export interface CreateLogDTO {
  status: number;
  message: string;
  detais: string;
  instance_error: string;
  is_temp?: boolean;
}
