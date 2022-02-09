import React, {useEffect, useState} from "react"; 
import Header from "../../common/header/Header";
import UpcomingMoviesGrid from '../../common/grids/UpcomingMoviesGrid';
import ReleasedMoviesGrid from '../../common/grids/ReleasedMoviesGrid';
import './Home.css';

export default function Home(props) {
    const [movies, setMovies] = useState([]);
    const [upcoming, setUpcoming] = useState([]);

    useEffect(() => {
        getMovies();
        getUpcomingMovies();
    }, []);

    function getMovies() {
        fetch(props.baseUrl + `movies?page=1&limit=100`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
            },
          })
        .then((response) => response.json())
        .then((response) => setMovies(response.movies));
    }

    function getUpcomingMovies() {
        fetch(props.baseUrl + `movies?page=1&limit=100&status=PUBLISHED`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
            },
          })
          .then((response) => response.json())
          .then((response) => setUpcoming(response.movies));   
    }

    return(
        <div className="Home-page-container">
            <Header {...props} baseUrl={props.baseUrl} />
            <div className="upcoming-movies-container">
                <div className="upcoming-movies-header">Upcoming Movies</div>
                <div className="upcoming-movies-grid">
                   <UpcomingMoviesGrid movies={upcoming} /> 
                </div>
                    <ReleasedMoviesGrid {...props} movies={movies} baseUrl={props.baseUrl}/>
            </div>
        </div>
    );
};