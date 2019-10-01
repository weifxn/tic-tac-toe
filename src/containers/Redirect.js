import React, { useState, useEffect } from 'react'
import Firebase from '../firebase'
import TicTacToe from './TicTacToe'
export default () => {
    const [isRedirecting, setRedirecting] = useState(true)
    const [exist, setExist] = useState(0)
    useEffect(() => {
        getURL()
    }, [])
    const getURL = () => {
        const key = window.location.pathname.substr(1)
        console.log(key)
        Firebase.database()
            .ref('game')
            .child(key)
            .once('value')
            .then(snap => {
                if (snap.exists()) {
                    setExist(2)
                } else setExist(1)
            })
    }

    return (
        <div>
            {exist === 0 &&
                <div>
                    <p>Loading Game..</p>
                    <a href="/">Go Back?</a>
                </div>
            }
            {exist === 1 &&
                <div>
                    <p>URL not found</p>
                    <a href="/">Go Back?</a>
                </div>
            }

            {exist === 2 && <TicTacToe />}
        </div>
    )
}