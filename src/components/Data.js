import React, { useState, useEffect } from 'react'
import axios from 'axios'
import BootStrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import { Modal, Button } from 'react-bootstrap'
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter'

const Data = () => {

    const [coins, setCoins] = useState([])
    const [modalInfo, setModalInfo] = useState([])
    const [showModal, setShowModal] = useState(false)

    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const getCoinData = async () => {
        try {
            const data = await axios.get('https://api.coinpaprika.com/v1/tickers')
            console.log(data.data)
            setCoins(data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCoinData()
    }, [])

    const columns = [
        {dataField: "rank", text: "Rank", sort: true, headerStyle: () => {return { width: "60px" }}, align: 'right' },
        {dataField: "name", filter: textFilter({placeholder: 'Enter Coin Name'})},
        {dataField: "symbol", text: "Symbol"},
        {dataField: "quotes.USD.price", text: "Price", align: 'right'},
        {dataField: "quotes.USD.percent_change_24h", text: "Price 24h %", sort: true, align: 'right'},
        {dataField: "quotes.USD.market_cap", text: "Marketcap", sort: true, align: 'right'}
    ]

    const rowEvents = {
        onClick: (e, row) => {
            console.log(row)
            setModalInfo(row)
            toggleTrueFalse()
        }
    }


    const toggleTrueFalse = () => {
        setShowModal(handleShow)
    }

    

	const defaultSorted = [{
		dataField: 'quotes.USD.market_cap',
		order: 'desc'
      }];
      
    const rowStyle2 = (row, rowIndex) => {
        const style = {};
        if (row.quotes.USD.percent_change_24h > 0) {
            style.background = '#f0fff0';
        } else if (row.quotes.USD.percent_change_24h < 0) {
            style.background = '#fff0f0';
        } else {
            style.background = 'white'
        }
        
        return style;
    };

    const ModalContent = () => {
        return (
            <Modal show={show} onHide={handleClose}>

                <Modal.Header closeButton  style={modalInfo.quotes.USD.percent_change_24h > 0 ? {background:'#f0fff0'} : {background:'#fff0f0'}}>
                    <Modal.Title>{modalInfo.name}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <ul>
                        <ol>beta value:<br/> {modalInfo.beta_value}</ol><br/>
                        <ol>circulating supply:<br/> {modalInfo.circulating_supply}</ol><br/>
                        <ol>last updated:<br/> {modalInfo.last_updated}</ol><br/>
                        <ol>max_supply:<br/> {modalInfo.max_supply}</ol><br/>
                        <ol>rank:<br/> {modalInfo.rank}</ol><br/>
                        <ol>symbol:<br/> {modalInfo.symbol}</ol><br/>
                        <ol>total supply:<br/> {modalInfo.total_supply}</ol>
                    </ul>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>

            </Modal>
        )
    }

    return (
        <>
            <div style={{height:'40vh', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', width:'1005'}}>
                <h2>SEARCH COINS</h2>
                <p>click on coin for more info</p>
            </div>

            <BootStrapTable 
                keyField="name"
                data={coins}
                columns={columns}
                pagination={paginationFactory()}
                rowEvents={rowEvents}
                defaultSorted={ defaultSorted }
                filter={ filterFactory() }
                rowStyle={ rowStyle2 }
            />

            { show ? <ModalContent /> : null }
        </>
    )
}

export default Data
