import { useEffect, useState } from 'react'
import axios from 'axios'
import MuhalikConfig from '../sdk/almakan.config'

export default function useFlatsInfiniteScroll(pageNumber, limit) {
    const [flats_loading, setLoading] = useState(true)
    const [flats_error, setError] = useState('')
    const [flats_array, setProducts] = useState([])
    const [flats_hasMore, setHasMore] = useState(true)
    const [flats_pages, setPages] = useState(0)
    const [flats_total, setTotal] = useState(0)

    useEffect(() => {
        let unmounted = true
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const getData = () => {
            setLoading(true)
            const _url = MuhalikConfig.PATH + `/products/`
            axios({
                method: 'GET',
                url: _url,
                params: { page: pageNumber, limit: limit },
                cancelToken: source.token
            }).then(res => {
                if (unmounted) {
                    setLoading(false)
                    setProducts(prevProducts => {
                        return [...new Set([...prevProducts, ...res.data.data.docs])]
                    })
                    setHasMore(pageNumber < res.data.data.pages)
                    setTotal(res.data.data.total)
                    setPages(res.data.data.pages)
                }
            }).catch(err => {
                if (unmounted) {
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
    }, [pageNumber])

    return { flats_loading, flats_error, flats_array, flats_pages, flats_total, flats_hasMore }
}