import { useEffect, useState } from 'react'
import axios from 'axios'
import MuhalikConfig from '../sdk/almakan.config'

export default function useNewArrivalTopRankingScroll(q, pageNumber, limit) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [products, setProducts] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [pages, setPages] = useState(0)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        setProducts([])
    }, [q])

    useEffect(() => {
        let unmounted = true
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const getData = () => {
            setLoading(true)
            setError(false)
            const _url = MuhalikConfig.PATH + `/products/new-arrivals`
            axios({
                method: 'GET',
                url: _url,
                params: { page: pageNumber, limit: limit },
                cancelToken: source.token
            }).then(res => {
                if (unmounted) {
                    setLoading(false)
                    setProducts(prevPro => {
                        return [...new Set([...prevPro, ...res.data.data.docs])]
                    })
                    setHasMore(res.data.data.length > 0)
                    setTotal(res.data.data.total)
                    let count = res.data.data.total / 20
                    let rounded = Math.floor(count);
                    let decimal = count - rounded;
                    if (decimal > 0) {
                        setPages(rounded + 1)
                    } else {
                        setPages(rounded)
                    }
                }
            }).catch(err => {
                if (unmounted) {
                    setHasMore(false)
                    setLoading(false)
                    if (axios.isCancel(err)) return
                    setError(true)
                }
            })
        }
        getData()
        return () => {
            unmounted = false
            source.cancel();
        };
    }, [q, pageNumber])

    return { loading, error, products, pages, total, hasMore }
}