import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import pool from '../../config/db';
import { IIssue } from './issues.interfaces';

// 1. Create a brand new issue
export const createIssue = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, description, type } = req.body;
    const reporter_id = (req.user as any).id;

    // Strict validation for incoming payload fields
    if (!title || !description || !type) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message:
          'Validation failed: title, description, and type are mandatory fields.',
      });
      return;
    }

    const insertQuery = `
      INSERT INTO issues (title, description, type, reporter_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(insertQuery, [
      title,
      description,
      type,
      reporter_id,
    ]);
    const newIssue: IIssue = result.rows[0];

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Issue registered and created successfully',
      data: newIssue,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'An error occurred while creating the issue.',
    });
  }
};

// 2. Retrieve all issues from database
export const getAllIssues = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const selectQuery = 'SELECT * FROM issues ORDER BY created_at DESC';
    const result = await pool.query(selectQuery);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'All issues fetched successfully',
      data: result.rows,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'An error occurred while fetching issues.',
    });
  }
};

// 3. Fetch a singular issue detail by its specific ID
export const getIssueById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const findQuery = 'SELECT * FROM issues WHERE id = $1';
    const result = await pool.query(findQuery, [id]);
    const issue = result.rows[0];

    if (!issue) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: `Issue with target identifier ID ${id} could not be located.`,
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Target issue analytics fetched successfully',
      data: issue,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message:
        error.message ||
        'An error occurred while retrieving target issue metrics.',
    });
  }
};

// 4. Update dynamic parameters of an issue (e.g., status, description)
export const updateIssue = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, type, status } = req.body;

    // Confirm existence profile prior to committing updates
    const checkQuery = 'SELECT * FROM issues WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);
    const existingIssue = checkResult.rows[0];

    if (!existingIssue) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message:
          'The requested issue profile does not exist within the system architecture.',
      });
      return;
    }

    // Coalesce incoming changes with pre-existing database records gracefully
    const updatedTitle = title || existingIssue.title;
    const updatedDescription = description || existingIssue.description;
    const updatedType = type || existingIssue.type;
    const updatedStatus = status || existingIssue.status;

    const updateQuery = `
      UPDATE issues 
      SET title = $1, description = $2, type = $3, status = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `;
    const result = await pool.query(updateQuery, [
      updatedTitle,
      updatedDescription,
      updatedType,
      updatedStatus,
      id,
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Issue matrix updated successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message:
        error.message ||
        'An error occurred during updating the issue attributes.',
    });
  }
};

// 5. Hard delete an issue resource profile from system entirely
export const deleteIssue = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const deleteQuery = 'DELETE FROM issues WHERE id = $1 RETURNING id';
    const result = await pool.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message:
          'Target issue node could not be deleted because it does not exist.',
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message:
        'Issue node purged and dropped from database register successfully',
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message:
        error.message ||
        'An error occurred during dropping the database issue matrix.',
    });
  }
};
