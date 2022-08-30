import React from 'react'
import Navbar from '../../components/navbar/Navbar'
import Read from '../../components/read/Read'

const ReadPage = () => {
    return (
        <div className='homeWrapper'>
            <div className='home'>
                <Navbar />
                <Read />
                <div className="creator">
                    <p>Created by Shreyansh Malviya</p>
                </div>
            </div>
        </div>
    )
}
export default ReadPage;