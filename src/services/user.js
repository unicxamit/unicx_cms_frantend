import React from 'react'

const user = () => {

    const user = JSON.parse(localStorage.getItem('user'))
    const {role} = user
    const isAdmin = role === 'admin'
    const isUser = role === 'user'
  return (
    <>
    <div>
        

    </div>
    </>
  )
}

export default user
