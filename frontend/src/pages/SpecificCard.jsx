import React, { useEffect, useState } from 'react'
import NavBar from '../components/Navbar'
import { Container, Row, Col } from 'react-bootstrap'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import { FaAngleDoubleUp, FaAngleUp } from 'react-icons/fa'


export default function SpecificCard() {
    const location = useLocation();
    const chapter_no = location.state
    const [content, setContent] = useState([]);

    
    const [visible, setVisible] = useState(false);

    const topFunction = () => {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    const getSurahVerses = async ()=>{

        try{
            const uri = 'http://localhost:9001/get-surahs/surah-info'
            const response = await axios.post(uri, {chapter: chapter_no })
            setContent(response.data.verses)

        }
        catch(error){
            console.log(error.response.data.message);
        }

    }
    useEffect(()=>{
        getSurahVerses();

        window.addEventListener('scroll', topFunction);
    return () => {
      window.removeEventListener('scroll', topFunction);
    };
    }, [])


  return (
    <div>
       <NavBar />
       <Container className='d-flex justify-content-center bg-secondary rounded mt-5' >
        <Row className='gy-3'>
            {
                content.map((verse, index)=>{
                    return (
                        <div className='.bg-secondary.bg-gradient rounded' key={verse.id}>
                        <Col md = {12} className='p-3 bg-light text-right' ><span><h4>{verse.verse_number}</h4></span>{ verse.text_uthmani}</Col>
                        <Col md = {12} className='p-3 bg-light' >{verse.translations[0].text.replace(/<\/?[^>]+(>|$)/g, "")}</Col>
                        </div>
                    )
                })
            }
            
        </Row>

        <button
        style={{ display: visible ? 'block' : 'none' }}
        className='Scroll-to-top'
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
        <FaAngleUp />
        </button>     

       </Container>
    </div>
  )
}
