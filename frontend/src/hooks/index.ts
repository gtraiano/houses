// credit https://medium.com/swlh/usefetch-a-custom-react-hook-36d5f5819d8
import { useState, useEffect } from 'react';

interface UseFetchProps {
    initialUrl: string,
    initialParams: { [key: string]: string },
    skip?: boolean
}

const useFetch = ({ initialUrl, initialParams = {}, skip = false}: UseFetchProps) => {
    const [url, updateUrl] = useState(initialUrl)
    const [params, updateParams] = useState(initialParams)
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [refetchIndex, setRefetchIndex] = useState(0)
    const queryString = Object.keys(params)
      .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key])).join('&')
    const refetch = () => setRefetchIndex((prevRefetchIndex) => prevRefetchIndex + 1)
    
    useEffect(() => {
      const fetchData = async () => {
        if (skip) return
        setIsLoading(true)
        try {
          const response = await fetch(`${url}${queryString}`)
          const result = await response.json()
          if (response.ok) {
            setData(result)
          } else {
            setHasError(true)
            setErrorMessage(result)
          }
        }
        catch (err: any) {
          setHasError(true)
          setErrorMessage(err.message)
        }
        finally {
          setIsLoading(false)
        }
      }
      fetchData()
    }, [url, params, refetchIndex]);
    
    return { data, isLoading, hasError, errorMessage, updateUrl, updateParams, refetch };
  }
  
  export default useFetch