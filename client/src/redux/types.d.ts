import { StateType, ActionType } from 'typesafe-actions';

declare module 'typesafe-actions' {
    export type Store = StateType<typeof import('./store').store>;

    export type RootState = StateType<typeof import('./root.reducer').default>;

    export type RootAction = ActionType<
        typeof import('./actions/defaultExported').default
    >;

    interface Types {
        RootAction: RootAction;
    }
}
