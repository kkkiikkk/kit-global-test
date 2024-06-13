// Tools
import { TaskStatuses } from '../../db/entites/task.entity';

export interface IQueryTaskFilters {
  status: TaskStatuses;
}
