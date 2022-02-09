import React from "react"; 
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import './UpcomingMoviesGrid.css';

const styles = theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      flexWrap: 'nowrap',
      transform: 'translateZ(0)',
    },
    title: {
      color: '#fff',
    },
    titleBar: {
      background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
});

function UpcomingMoviesGrid(props) {
    const { classes } = props;

    return(
        <div className={classes.root}>
            <GridList className={classes.gridList} cols={2.5}>
                {props.movies.map(tile => (
                    <GridListTile className="upcoming-tile" key={tile.poster_url}>
                        <img src={tile.poster_url} alt={tile.title} />
                        <GridListTileBar title={tile.title} classes={{ root: classes.titleBar, title: classes.title, }} />
                    </GridListTile>
                ))}
            </GridList>
        </div>
    );
}

UpcomingMoviesGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(UpcomingMoviesGrid);