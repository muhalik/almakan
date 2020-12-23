import { useEffect, useState } from 'react'
import axios from 'axios'
import AlMakanConfig from '../sdk/almakan.config'

export default function getUsersPageLimit(token, url, pageNumber, limit) {
    const [users_loading, setLoading] = useState(false)
    const [users_error, setError] = useState('')
    const [users, setUsers] = useState([])
    const [users_pages, setPages] = useState(0)
    const [users_total, setTotal] = useState(0)
    const [hasMore, setHasMore] = useState()

    useEffect(() => {
        let unmounted = true
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const getData = () => {
            setLoading(true)
            setError(false)
            const _url = AlMakanConfig.PATH + `/users/${url}`
            axios({
                method: 'GET',
                url: _url,
                headers: {
                    'authorization': token
                },
                params: { page: pageNumber, limit: limit },
                cancelToken: source.token
            }).then(res => {
                if (unmounted) {
                    setLoading(false)
                    setUsers(prevPro => {
                        return [...new Set([...prevPro, ...res.data.data.docs])]
                    })
                    setPages(res.data.data.pages)
                    setTotal(res.data.data.total)
                    setHasMore(pageNumber < res.data.data.pages)
                }
            }).catch(err => {
                if (unmounted) {
                    setLoading(false)
                    if (axios.isCancel(err)) return
                    setError(true)
                }
            })
        }
        if (token != null)
            getData()
        return () => {
            unmounted = false
            source.cancel();
        };
    }, [pageNumber, token])

    return { users_loading, users_error, users, users_pages, hasMore, users_total }
}