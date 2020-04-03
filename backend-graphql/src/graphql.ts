
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum TaskStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE"
}

export class AuthCredentials {
    username?: string;
    password?: string;
}

export class CreateTaskDto {
    title: string;
    description: string;
}

export class UpdateTaskStatusDto {
    status: TaskStatus;
}

export class JwtToken {
    accessToken?: string;
}

export abstract class IMutation {
    abstract signIn(signInForm: AuthCredentials): JwtToken | Promise<JwtToken>;

    abstract signUp(signUpForm: AuthCredentials): User | Promise<User>;

    abstract createTask(newTaskForm: CreateTaskDto): Task | Promise<Task>;

    abstract updateStatus(id: string, newStatus?: UpdateTaskStatusDto): Task | Promise<Task>;

    abstract deleteTask(id: string): string | Promise<string>;
}

export abstract class IQuery {
    abstract user(name?: string): User | Promise<User>;

    abstract task(taskID: string): Task | Promise<Task>;

    abstract tasks(): Task[] | Promise<Task[]>;
}

export class Task {
    _id?: string;
    user?: User;
    userId?: string;
    title?: string;
    description?: string;
    status?: TaskStatus;
}

export class User {
    _id?: string;
    username?: string;
    password?: string;
    tasks?: Task[];
}
