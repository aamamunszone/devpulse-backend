import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import pool from '../../config/db';
import { IUserResponse } from './auth.interfaces';

// Handles new user account registration
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Validate request body parameters strictly
    if (!name || !email || !password) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message:
          'Validation failed: name, email, and password are required fields.',
      });
      return;
    }

    // Check if the user email already exists using Raw SQL
    const checkUserQuery = 'SELECT id FROM users WHERE email = $1';
    const existingUser = await pool.query(checkUserQuery, [email]);

    if (existingUser.rows.length > 0) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'An account with this email already exists.',
      });
      return;
    }

    // Secure password processing with bcrypt (salt rounds within 8-12 constraint)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Enforce default system role if not explicitly passed
    const accountRole = role || 'contributor';

    // Persist new record via direct pool query execution
    const insertUserQuery = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at, updated_at
    `;

    const result = await pool.query(insertUserQuery, [
      name,
      email,
      hashedPassword,
      accountRole,
    ]);
    const registeredUser: IUserResponse = result.rows[0];

    // Send 210 Created successful response structure
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User registered successfully',
      data: registeredUser,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message:
        error.message ||
        'Internal server error encountered during registration.',
    });
  }
};

// Validates credentials and yields authorization token
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Basic fields validation
    if (!email || !password) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Email and password are required parameters.',
      });
      return;
    }

    // Fetch user details from PostgreSQL database
    const findUserQuery = 'SELECT * FROM users WHERE email = $1';
    const userResult = await pool.query(findUserQuery, [email]);
    const user = userResult.rows[0];

    // Safeguard against invalid identifier
    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid email or password credentials provided.',
      });
      return;
    }

    // Verify stored hash matrix matches incoming password payload
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid email or password credentials provided.',
      });
      return;
    }

    // Generate JWT payload with identity details for subsequent role validation
    const tokenPayload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    // Sign the application token
    const accessToken = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET as string,
      {
        expiresIn: '24h',
      },
    );

    // Strip password from the profile object before broadcasting
    const sanitizedUserProfile: IUserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    // Dispatch payload wrapped in structural template
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Login successful',
      data: {
        token: accessToken,
        user: sanitizedUserProfile,
      },
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message:
        error.message ||
        'Internal server error encountered during authentication.',
    });
  }
};
