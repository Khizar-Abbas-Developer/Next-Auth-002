"use client";

import { store } from "@/redux/index";
import { CacheProvider } from '@chakra-ui/next-js'
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '@/redux/index';
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from "react-redux";

export const ReduxProvider = ({children})=>{
    return <Provider store={store}>{children}</Provider>
}


export function Providers({ children }) {
  return (
    <CacheProvider>
      <ChakraProvider>{children}</ChakraProvider>
    </CacheProvider>
  )
}

export const PersistProvider = ({children})=>{
  return <PersistGate persistor={persistor} loading={null}>{children}</PersistGate>   
}