import React, { useState, useEffect } from 'react'
import Firebase from '../firebase'
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    InputGroup,
    CardSubtitle,
    InputGroupAddon,
    FormInput,
} from 'shards-react'
import './style.css'
import dayjs from 'dayjs'
import md5 from 'md5';
import * as Icon from 'react-feather';


const urlRegEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

export default () => {
    const refURL = Firebase.database().ref('game')
    const [url, setURL] = useState('')
    const [urlList, setURLList] = useState([])
    useEffect(() => { getURL() }, [])

    const getURL = () => {
        refURL
            .orderByChild('timestamp')
            .on('value', snap => {
                var data = []
                if (snap !== null) {
                    snap.forEach(item => {
                        data.push({
                            count: item.val().count,
                            key: item.key,
                            url: item.val().url,
                        })
                    })
                    setURLList(data.reverse())
                }
            })
    }
    const submitURL = event => {
        event.preventDefault();
        window.location.href = url
    }

    const onPushData = url => {
        const key = md5(url + urlList.length).substring(0, 5)
        urlRegEx.test(url) && refURL
            .child(key)
            .set({ count: 0, url, timestamp: dayjs().format() })
        setURL('')
    }

    const removeURL = key => refURL.child(key).remove()

    const createGame = () => {
        const key = Math.random().toString(36).substring(2, 7)
        refURL.child(key).set({ newGame: true }).then(() => window.location.href = key)
        localStorage.setItem(key, true);

    }

    return (
        <div>
            <div className="title">tic tac toe</div>
            <div>
                <form onSubmit={submitURL}>
                    <InputGroup>
                        <FormInput onChange={e => setURL(e.target.value)} value={url} placeholder="Enter invite code" />
                        <InputGroupAddon type="append">
                            <Button outline theme="secondary">
                                <Icon.ChevronRight size={20} />
                            </Button>
                        </InputGroupAddon>
                    </InputGroup>
                </form>
            </div>
            <div className="button">
                <Button
                    onClick={() => createGame()}
                    size="bg"
                    theme="light"
                    outline
                >Create New Game</Button>
            </div>

        </div>
    )
}




