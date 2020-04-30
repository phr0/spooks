import { useState } from "react";

export function useLocalStorage<TData>(key: string,initialData:TData):[TData,(newData:TData)=>void]{
    const [inMemoryData, setInMemoryData] = useState(localStorage[key] ? JSON.parse(localStorage[key]) as TData : initialData);

    function setData(newData:TData){
        localStorage.setItem(key,JSON.stringify(newData));
        setInMemoryData(newData);
    }
    return [inMemoryData,setData];
}