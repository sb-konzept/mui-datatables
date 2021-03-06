import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import intersperse from 'ramda/src/intersperse';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import { TextField, Grid, GridList, GridListTile } from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';
import compose from 'ramda/src/compose';
import setHours from 'date-fns/fp/setHours';
import setMinutes from 'date-fns/fp/setMinutes';

const initialFromDate = compose(
  setHours(0),
  setMinutes(0),
);

const initialToDate = compose(
  setHours(23),
  setMinutes(59),
);

export const defaultFilterStyles = theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    padding: '16px 24px 16px 24px',
    fontFamily: 'Roboto',
  },
  header: {
    flex: '0 0 auto',
    marginBottom: '16px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    display: 'inline-block',
    marginLeft: '7px',
    color: theme.palette.text.primary,
    fontSize: '14px',
    fontWeight: 500,
  },
  noMargin: {
    marginLeft: '0px',
  },
  reset: {
    alignSelf: 'left',
  },
  resetLink: {
    marginLeft: '16px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  filtersSelected: {
    alignSelf: 'right',
  },
  /* checkbox */
  checkboxListTitle: {
    marginLeft: '7px',
    marginBottom: '8px',
    fontSize: '14px',
    color: theme.palette.text.secondary,
    textAlign: 'left',
    fontWeight: 500,
  },
  checkboxFormGroup: {
    marginTop: '8px',
  },
  checkboxFormControl: {
    margin: '0px',
  },
  checkboxFormControlLabel: {
    fontSize: '15px',
    marginLeft: '8px',
    color: theme.palette.text.primary,
  },
  checkboxIcon: {
    width: '32px',
    height: '32px',
  },
  checkbox: {
    '&$checked': {
      color: theme.palette.primary.main,
    },
  },
  checked: {},
  /* selects */
  selectRoot: {
    display: 'flex',
    marginTop: '16px',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '80%',
    justifyContent: 'space-between',
  },
  selectFormControl: {
    flex: '1 1 calc(50% - 24px)',
    marginRight: '24px',
    marginBottom: '24px',
  },
  /* textField */
  textFieldRoot: {
    display: 'flex',
    marginTop: '16px',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  textFieldFormControl: {
    flex: '1 1 calc(50% - 24px)',
    marginRight: '24px',
    marginBottom: '24px',
  },
});

class TableFilter extends React.Component {
  static propTypes = {
    /** Data used to populate filter dropdown/checkbox */
    filterData: PropTypes.array.isRequired,
    /** Data selected to be filtered against dropdown/checkbox */
    filterList: PropTypes.array.isRequired,
    /** Options used to describe table */
    options: PropTypes.object.isRequired,
    /** Callback to trigger filter update */
    onFilterUpdate: PropTypes.func,
    /** Callback to trigger filter reset */
    onFilterRest: PropTypes.func,
    /** Extend the style applied to components */
    classes: PropTypes.object,
  };

  handleCheckboxChange = (index, value, column) => {
    this.props.onFilterUpdate(index, value, column, 'checkbox');
  };

  handleDropdownChange = (event, index, column) => {
    const labelFilterAll = this.props.options.textLabels.filter.all;
    const value = event.target.value === labelFilterAll ? '' : event.target.value;
    this.props.onFilterUpdate(index, value, column, 'dropdown');
  };

  handleMultiselectChange = (index, value, column) => {
    this.props.onFilterUpdate(index, value, column, 'multiselect');
  };

  handleTextFieldChange = (event, index, column) => {
    this.props.onFilterUpdate(index, event.target.value, column, 'textField');
  };

  handleDateRangeChange = (index, value, start, column) => {
    this.props.onFilterUpdate(index, { start, value }, column, 'dateRange');
  };

  handleCustomChange = (value, index, column) => {
    this.props.onFilterUpdate(index, value, column.name, column.filterType);
  };

  renderCheckbox(column, index) {
    const { classes, filterData, filterList } = this.props;

    return (
      <GridListTile key={index} cols={1}>
        <FormGroup>
          <FormControlLabel
            classes={{
              root: classes.checkboxFormControl,
              label: classes.checkboxFormControlLabel,
            }}
            control={
              <Checkbox
                className={classes.checkboxIcon}
                onChange={this.handleCheckboxChange.bind(null, index, null, column.name)}
                checked={filterList[index][0] != null}
                classes={{
                  root: classes.checkbox,
                  checked: classes.checked,
                }}
                value={filterList[index][0]}
                indeterminate={filterList[index][0] === false}
              />
            }
            label={column.label}
          />
        </FormGroup>
      </GridListTile>
    );
  }

  renderSelect(column, index) {
    const { classes, filterData, filterList, options } = this.props;
    const textLabels = options.textLabels.filter;

    return (
      <GridListTile key={index} cols={1}>
        <div className={classes.selectRoot}>
          <FormControl className={classes.selectFormControl} key={index}>
            <InputLabel htmlFor={column.name}>{column.label}</InputLabel>
            <Select
              value={filterList[index].toString() || textLabels.all}
              name={column.name}
              onChange={event => this.handleDropdownChange(event, index, column.name)}
              input={<Input name={column.name} id={column.name} />}>
              <MenuItem value={textLabels.all} key={0}>
                {textLabels.all}
              </MenuItem>
              {filterData[index].map((filterValue, filterIndex) => (
                <MenuItem value={filterValue.name || filterValue} key={filterIndex + 1}>
                  {filterValue != null ? (filterValue.label || filterValue).toString() : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </GridListTile>
    );
  }

  renderTextField(column, index) {
    const { classes, filterList } = this.props;

    return (
      <GridListTile key={index} cols={1}>
        <div className={classes.textFieldRoot}>
          <FormControl className={classes.textFieldFormControl} key={index}>
            <TextField
              label={column.label}
              value={filterList[index].toString() || ''}
              onChange={event => this.handleTextFieldChange(event, index, column.name)}
            />
          </FormControl>
        </div>
      </GridListTile>
    );
  }

  renderDateRange(column, index) {
    const { classes, filterData, filterList, options } = this.props;
    const textLabels = options.textLabels.dateRange;

    return (
      <GridListTile key={index} cols={1}>
        <div className={classes.selectRoot}>
          <InputLabel shrink>{column.label}</InputLabel>
          <Grid container spacing={8}>
            <Grid item xs={12} lg={6}>
              <DateTimePicker
                ampm={false}
                clearable
                initialFocusedDate={initialFromDate(new Date())}
                value={(filterList[index][0] && filterList[index][0][0]) || null}
                onChange={value => this.handleDateRangeChange(index, value, true, column)}
                label={textLabels.from}
                cancelLabel={textLabels.cancel}
                clearLabel={textLabels.clear}
                okLabel={textLabels.ok}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <DateTimePicker
                ampm={false}
                clearable
                initialFocusedDate={initialToDate(new Date())}
                value={(filterList[index][0] && filterList[index][0][1]) || null}
                onChange={value => this.handleDateRangeChange(index, value, false, column)}
                label={textLabels.to}
                cancelLabel={textLabels.cancel}
                clearLabel={textLabels.clear}
                okLabel={textLabels.ok}
              />
            </Grid>
          </Grid>
        </div>
      </GridListTile>
    );
  }

  renderMultiselect(column, index) {
    const { classes, filterData, filterList, options } = this.props;

    return (
      <GridListTile key={index} cols={1}>
        <div className={classes.selectRoot}>
          <FormControl className={classes.selectFormControl} key={index}>
            <InputLabel htmlFor={column.name}>{column.label}</InputLabel>
            <Select
              multiple
              value={filterList[index] || []}
              renderValue={selected =>
                intersperse(
                  ', ',
                  selected.map(s => (typeof column.customBodyRender === 'function' ? column.customBodyRender(s) : s)),
                )
              }
              name={column.name}
              onChange={event => this.handleMultiselectChange(index, event.target.value, column.name)}
              input={<Input name={column.name} id={column.name} />}>
              {filterData[index].map((filterValue, filterIndex) => (
                <MenuItem value={filterValue} key={filterIndex + 1}>
                  <Checkbox
                    checked={filterList[index].indexOf(filterValue) >= 0 ? true : false}
                    value={filterValue}
                    className={classes.checkboxIcon}
                    classes={{
                      root: classes.checkbox,
                      checked: classes.checked,
                    }}
                  />
                  <ListItemText
                    primary={
                      typeof column.customBodyRender === 'function' ? column.customBodyRender(filterValue) : filterValue
                    }
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </GridListTile>
    );
  }

  renderCustomField(column, index) {
    const { classes, filterList, options } = this.props;
    const display = column.customFilterRender;

    if (!display) {
      console.error('Property "customFilterRender" is required when using custom filter type.');
      return;
    }

    return (
      <GridListTile key={index} cols={1} classes={{ tile: classes.gridListTile }}>
        <FormControl key={index} fullWidth>
          {display(filterList, this.handleCustomChange, index, column)}
        </FormControl>
      </GridListTile>
    );
  }

  render() {
    const { classes, columns, options, onFilterReset } = this.props;
    const textLabels = options.textLabels.filter;
    const filterGridColumns = columns.filter(col => col.filter).length === 1 ? 1 : 2;

    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <div className={classes.reset}>
            <Typography
              variant="body2"
              className={classNames({
                [classes.title]: true,
              })}>
              {textLabels.title}
            </Typography>
            <Button
              color="primary"
              className={classes.resetLink}
              tabIndex={0}
              aria-label={textLabels.reset}
              onClick={onFilterReset}>
              {textLabels.reset}
            </Button>
          </div>
          <div className={classes.filtersSelected} />
        </div>
        <GridList cellHeight="auto" cols={filterGridColumns}>
          {columns.map((column, index) => {
            if (column.filter) {
              const filterType = column.filterType || options.filterType;
              return filterType === 'checkbox'
                ? this.renderCheckbox(column, index)
                : filterType === 'multiselect'
                ? this.renderMultiselect(column, index)
                : filterType === 'textField'
                ? this.renderTextField(column, index)
                : filterType === 'dateRange'
                ? this.renderDateRange(column, index)
                : filterType === 'custom'
                ? this.renderCustomField(column, index)
                : this.renderSelect(column, index);
            }
          })}
        </GridList>
      </div>
    );
  }
}

export default withStyles(defaultFilterStyles, { name: 'MUIDataTableFilter' })(TableFilter);
