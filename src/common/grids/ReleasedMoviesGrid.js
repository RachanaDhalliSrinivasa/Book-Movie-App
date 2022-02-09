import React, {useEffect, useState} from "react"; 
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import './ReleasedMoviesGrid.css';

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
      minWidth: 240,
    }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function ReleasedMoviesGrid(props) {
    const { classes } = props;
    const [genres, setGenres] = useState([]);
    const [applyGenres, setApplyGenres] = useState([]);
    const [artists, setArtists] = useState([]);
    const [applyArtists, setApplyArtists] = useState([]);
    const [showMovies, setShowMovies] = useState([]);
    const [form, setForm] = useState({});
    let releasedMovies = props.movies.filter((movie) => movie.status === 'RELEASED');

    useEffect(() => {
      getGenres();
      getArtists();
      setShowMovies(releasedMovies);
  }, [props.movies]);

  function getGenres() {
    fetch(props.baseUrl + "genres", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      })
      .then((response) => response.json())
      .then((response) => setGenres(response.genres));
  }

  let genreArray = [];
    genres.map(genre => genreArray.push(genre.genre));

    function getArtists() {
        fetch(props.baseUrl + `artists?page=1&limit=100`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
            },
          })
          .then((response) => response.json())
          .then((response) => setArtists(response.artists));
    }

    let artistArray = [];
    artists.map(artist => artistArray.push(`${artist.first_name} ${artist.last_name}`));

    function handleFormChange(e) {
        const { name, value } = e.target;  
        setForm((prevState) => {
            return {
              ...prevState,
              [name]: value,
            };
        });
    }

    function apply() {
      if(applyGenres || applyArtists) {
        setForm((prevState) => {
          return {
            ...prevState,
            // eslint-disable-next-line
            ['genres']: applyGenres,
            // eslint-disable-next-line
            ['artists']: applyArtists,
          };
        });
      }
      let fMovies = [];
      let fMoviesID = [];
      if(form.movieName) {
        console.log(props.movies)
          fMovies.push(props.movies.filter((movie) => movie.title.toLowerCase() === form.movieName.toLowerCase()));
      }
      if(applyGenres.length>0) {
        let fArr = [];
        for(let i=0; i<applyGenres.length; i++) {
          fArr = props.movies.filter((movie) => movie.genres.includes(applyGenres[i]));
        }
        fMovies.push(...fArr);
      } 
      if(applyArtists.length>0) {
        let arr = [];
        for(let i=0; i<applyArtists.length; i++) {
          props.movies.forEach(movie => {
            if(movie.artists) {
              movie.artists.forEach(artist => {
                if(applyArtists.includes(`${artist.first_name} ${artist.last_name}`)) {
                  arr.push(movie);
                }
              })
            }
          })
        }

        fMovies.push(...arr);
      } 
      if(form.releaseStartDate) {
        fMovies.push(...props.movies.filter((movie) => movie.release_date > form.releaseStartDate));
      }
      if(form.releaseEndDate) {
        fMovies.push(...props.movies.filter((movie) => movie.release_date < form.releaseEndDate));
      }
      fMovies.forEach(m => {
        fMoviesID.push(m.id);
      })
      let uniqueChars = [];
      fMoviesID.forEach((c) => {
          if (!uniqueChars.includes(c)) {
              uniqueChars.push(c);
          }
      });

      let filteredM = [];
        fMovies.forEach(movie => {
          uniqueChars.forEach(id => {
              if((movie.id === id) && (!filteredM.includes(movie))) {
                filteredM.push(movie);
              }
            })
        })
        console.log(filteredM)
      if(fMovies.length>0) {
        setShowMovies(...filteredM);
      } else {
        setShowMovies(releasedMovies);
      }
    }

    const handleGenreChange = (event) => {
      const { target: { value }, } = event;
      setApplyGenres(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
    };

    const handleArtistChange = (event) => {
        const { target: { value }, } = event;
        setApplyArtists(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    function navigateToDetailsPage(e) {
      console.log(e.target)
      props.history.push(`/movie/${e.target.id}`);
    }

    return(
      <div className="released-movies-grid">
        <div className="released-movies-wrapper {classes.root}">
          <GridList cellHeight={350} className={classes.gridList}>
            <div className="released-movies">
                {showMovies.map(tile => (
                    <GridListTile className="released-tile" id={tile.id} key={tile.id} onClick={navigateToDetailsPage}>
                        <img src={tile.poster_url} id={tile.id} alt={tile.title} />
                        <GridListTileBar title={tile.title} subtitle={<span>Release Date: {new Date(tile.release_date).toDateString()}</span>}/>
                    </GridListTile> 
                ))}
            </div>
          </GridList>
        </div>
        <div className="filter-box">
            <Card sx={{ minWidth: 240 }}>
                <CardContent>
                <Typography sx={{ fontSize: 14 }} color="primary" gutterBottom>
                    FIND MOVIES BY:
                </Typography>
                <div className="form-container">
                    <TextField fullWidth id="standard-basic" label="Movie Name" name="movieName" onChange={handleFormChange} variant="standard" /> 
                    <FormControl fullWidth>
                        <InputLabel variant="standard" htmlFor="uncontrolled-native">Genres</InputLabel>
                        <Select name="genres" labelId="demo-multiple-checkbox-label" id="demo-multiple-checkbox" multiple value={applyGenres} onChange={handleGenreChange} renderValue={(selected) => selected.join(', ')} MenuProps={MenuProps} >
                            {genreArray.map((name) => (
                                <MenuItem key={name} value={name}>
                                    <Checkbox checked={applyGenres.indexOf(name) > -1} />
                                    <ListItemText primary={name} />
                                </MenuItem>
                            ))} 
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel variant="standard" htmlFor="uncontrolled-native">Artists</InputLabel>
                        <Select name="artists" labelId="demo-multiple-checkbox-label" id="demo-multiple-checkbox" multiple value={applyArtists} onChange={handleArtistChange} renderValue={(selected) => selected.join(', ')} MenuProps={MenuProps} >
                            {artistArray.map((name) => (
                                <MenuItem key={name} value={name}>
                                    <Checkbox checked={applyArtists.indexOf(name) > -1} />
                                    <ListItemText primary={name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth className="formfield">
                        <InputLabel variant="standard" shrink>Release Start Date</InputLabel>
                        <TextField className="formfield" type="date" name="releaseStartDate" inputProps={{ min: "2000-01-01", max: "2025-01-01" }} onChange={handleFormChange}/>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel variant="standard" shrink>Release End Date</InputLabel>
                        <TextField className="formfield" type="date" name="releaseEndDate" inputProps={{ min: "2000-01-01", max: "2025-01-01" }} onChange={handleFormChange}/>
                    </FormControl>
                </div>
                </CardContent>
                <CardActions>
                    <Button fullWidth className="form-btn" color="primary" variant="contained" onClick={apply}>APPLY</Button>
                </CardActions>
            </Card>
        </div>
        </div>
    );
}

ReleasedMoviesGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(ReleasedMoviesGrid);