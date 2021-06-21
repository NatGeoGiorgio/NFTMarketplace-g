
import {ModalComp} from './modal/modalComp'
import React, { Component } from 'react'
import Countup from './Countup/Countup'
import modalMat from './modalMat/modalMat'
import SpringModal from './modalMat/modalMat'

export default class CoolAnimation extends Component{
    
    render() {
        return (
        
            <>
            <SpringModal/>
            <Countup />
            </>
        )
    }
}

