import React, { useEffect, useState } from "react"; 
import Header from "../../common/header/Header";
import Typography from '@material-ui/core/Typography';
import YouTube from 'react-youtube';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import './Details.css';

const styles = theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      // width: 500,
      // height: 450,
    },
    card: {
      margin: theme.spacing.unit,
      minWidth: 140,
    }
});

const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
    } 
}

function Details(props) {
    let movieId = props.history.location.pathname.split('/')[2];
    const { classes } = props;

    const [movie, setMovie] = useState({});
    const [genres, setGenres] = useState([]);
    const [date, setDate] = useState('');
    const [trailer, setTrailer] = useState('');
    const [artists, setArtists] = useState([]);
    const [rate1, setRate1] = useState(false);
    const [rate2, setRate2] = useState(false);
    const [rate3, setRate3] = useState(false);
    const [rate4, setRate4] = useState(false);
    const [rate5, setRate5] = useState(false);

    useEffect(() => {
        getMovie();
    }, []);

    function getMovie() {
        fetch(props.baseUrl + `/movies/${movieId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
            },
          })
          .then((response) => response.json())
          .then((response) => {
              setMovie(response);
              setGenres(response.genres);
              setDate(response.release_date);
              setTrailer(response.trailer_url);
              setArtists(response.artists);
            });
    }

    let videoCode = '';
    if(trailer) {
        videoCode = trailer.split("v=")[1].split("&")[0];
    }

    function navigateToHomePage() {
        props.history.push("/");
    }

    function onReady(e) {
        e.target.pauseVideo();
    }

    function rater1() {
        setRate1(!rate1);
    }

    function rater2() {
        setRate2(!rate2);
    }

    function rater3() {
        setRate3(!rate3);
    }

    function rater4() {
        setRate4(!rate4);
    }

    function rater5() {
        setRate5(!rate5);
    }

    return(
        <div className="details-page-container">
            <Header {...props} />
            <div className="back-btn" onClick={navigateToHomePage}>
                <Typography>&#60; Back to Home</Typography>
            </div>
            <div className="details-wrapper">
                <div className="movie-potser">
                    <img className="image" src={movie.poster_url} alt={movie.title} />
                </div>
                <div className="movie-info">
                    <Typography variant="h2">
                        {movie.title}
                    </Typography>
                    <Typography>
                        <b>Genre:&nbsp;</b>
                        {genres.toString()}
                    </Typography>
                    <Typography>
                        <b>Duration: &nbsp;</b>
                        {movie.duration}
                    </Typography>
                    <Typography>
                        <b>Release Date: &nbsp;</b>
                        {new Date(date).toDateString()}
                    </Typography>
                    <Typography>
                        <b>Rating: &nbsp;</b>
                        {movie.rating}
                    </Typography>
                    <Typography className="plot">
                        <b>Plot: &nbsp;</b>
                        <a href={movie.wiki_url}>(Wiki Link)</a>
                        {movie.storyline}
                    </Typography>
                    <Typography className="trailer">
                        <b>Trailer:</b>
                    </Typography>
                    <YouTube className="yt" videoId={videoCode} opts={opts} onReady={onReady} />
                </div>
                <div className="movie-artists">
                    <Typography>
                        <b>Rate this movie: &nbsp;</b>
                        <br/>
                        <StarBorderIcon onClick={rater1} style={rate1 ? {fill: "yellow"} : {fill: "black"}} />
                        <StarBorderIcon onClick={rater2} style={rate2 ? {fill: "yellow"} : {fill: "black"}} />
                        <StarBorderIcon onClick={rater3} style={rate3 ? {fill: "yellow"} : {fill: "black"}} />
                        <StarBorderIcon onClick={rater4} style={rate4 ? {fill: "yellow"} : {fill: "black"}} />
                        <StarBorderIcon onClick={rater5} style={rate5 ? {fill: "yellow"} : {fill: "black"}} />
                    </Typography>
                    <Typography>
                        <b className="artist-title">Artists:</b>
                    </Typography>
                        <div className="artists-grid {classes.root}">
                            <GridList cellHeight={250} className={classes.gridList}>
                                <div className="artists">
                                    {artists && artists.map(tile => (
                                        <GridListTile cols={2} className="artist-tile" key={tile.id}>
                                            <img src={tile.profile_url} id={tile.id} alt={tile.first_name} />
                                            <GridListTileBar title={<span>{`${tile.first_name} ${tile.last_name}`}</span>}/>
                                        </GridListTile> 
                                    ))}
                                </div>
                            </GridList>
                        </div>
                </div>
            </div>
        </div>
    );
};

Details.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Details);