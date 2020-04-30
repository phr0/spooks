import { useState, useEffect, useCallback } from "react";
import { useInterval } from "./useInterval";
import { message } from "antd";

type GetAsyncDataFunctionType<T> = () => Promise<T>;
type PromiseState = "resolved" | "pending" | "error";

export interface IAsyncData<T> {
  data: T;
  reload: () => Promise<any>;
  promise: Promise<void> | undefined;
  setData: (newData: T) => void;
  promiseState: PromiseState;
}

export function useAsyncData<T>(
  fetchData: GetAsyncDataFunctionType<T>,
  initialValue: T
): IAsyncData<T> {
  const [promise, setPromise] = useState<Promise<void> | undefined>(undefined);
  const [data, setData] = useState<T>(initialValue);
  const [promiseState, setPromiseState] = useState<PromiseState>("pending");

  const fetchAsyncData = useCallback(() => {
    setPromiseState("pending");
    const fetchPromise = fetchData()
      .then(data => {
        console.log("data fetched", data);
        setData(data);
      })
      .then(() => setPromiseState("resolved"))
      .catch(error => {
        setData(initialValue);
        setPromiseState("error");
        throw error;
      });
    setPromise(fetchPromise);
    return fetchPromise;
  }, [fetchData, initialValue]);

  useEffect(() => {
    // tslint:disable-next-line:no-console
    console.info("fetchData changed, reloading async data");
    fetchAsyncData();
  }, [fetchData, fetchAsyncData]);

  return { data, reload: fetchAsyncData, promise, setData, promiseState };
}

interface IConcurrencyEnabledData {
  concurrencyToken?: string;
}

export function useAutoRefreshingAsyncData<
  T extends IConcurrencyEnabledData | undefined
>(
  fetchData: GetAsyncDataFunctionType<T>,
  initialValue: T,
  refreshIntervalInMs: number
): IAsyncData<T> {
  const asyncDataApi = useAsyncData(fetchData, initialValue);

  async function reloadAutomatically() {
    const newData = await fetchData();
    const isOneNull =
      [asyncDataApi.data, newData].filter(x => x == null).length === 1;
    const hasDataChanged =
      newData &&
      asyncDataApi.data &&
      newData.concurrencyToken !== asyncDataApi.data.concurrencyToken;

    if (isOneNull || hasDataChanged) {
      message.info("Daten wurden geändert");
    }
    asyncDataApi.setData(newData);
  }
  useInterval(reloadAutomatically, refreshIntervalInMs);

  return asyncDataApi;
}
