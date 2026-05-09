import React, { Component, useEffect } from 'react'
import { Client } from '../../../api/api';

export default function Home() {
    async function teste() {
        await Client.get('/profile').then(response => {
            
            console.log(response.data.data.email)
        })
    }

    useEffect(() => {
        teste()
    })

    return (
        <div>index</div>
    );
}
//12345678