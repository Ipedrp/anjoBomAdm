import React from "react"
import './Header.css'

function Header({title1, title2}) {

    return(
        <>
        <div className="container-down-header">
            <h1> {title1} <span>{title2}</span></h1>
        </div>

        </>
    )
    
}

export default Header