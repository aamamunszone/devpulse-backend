// Interface representing the user structure returned from database queries
export interface IUserResponse {
  id: number;
  name: string;
  email: string;
  role: 'contributor' | 'maintainer';
  created_at: Date;
  updated_at: Date;
}
