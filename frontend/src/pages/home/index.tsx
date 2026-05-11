import React, { Component, useEffect } from 'react'
import { Client } from '../../../api/api';

export default function HomeCliente() {
    //trocar por state de usuário, atualizar no login
    const usuario = {
        nome: ""
    }

    async function teste() {
        await Client.get('/profile').then(response => {
            usuario.nome = response.data.data.nome;
            console.log(usuario.nome);
            console.log(response.data.data.email);
        })
    }

    useEffect(() => {
        teste();
    })

    return (
        <div>Olá, {usuario.nome}</div>
    );
}
//12345678