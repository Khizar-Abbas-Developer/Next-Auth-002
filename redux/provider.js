"use client";

import { store } from "@/redux/index";
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '@/redux/index';
import { Provider } from "react-redux";

export const ReduxProvider = ({children})=>{
    return <Provider store={store}>{children}</Provider>
}

export const PersistProvider = ({children})=>{
  return <PersistGate persistor={persistor} loading={null}>{children}</PersistGate>   
}