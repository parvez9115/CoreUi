import { createAction, createReducer, on, props } from '@ngrx/store';


export const storeData = createAction('store', props<{ data: object }>());
export const resetData = createAction('reset')
let initialState;
export const invoiceReducer = createReducer(
    initialState = null,
    on(storeData, (state, param) => param.data),
    on(resetData, (state) => null)
)