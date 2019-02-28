import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

import "react-dates/lib/css/_datepicker.css";
import "react-dates/initialize";
import "./CalendarStyleOverride.css";

import { DateRangePicker, DayPickerRangeController } from "react-dates";

const styles = theme => ({
  root: {
    // display: "flex",
    // flexWrap: "wrap",
    padding: theme.spacing.unit
  },
  supportText: {
    top: -10
  }
});

class CalendarPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      focused: null,
      name: "hai",
      labelWidth: 10
    };
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <DateRangePicker
          startDate={this.state.startDate} // momentPropTypes.momentObj or null,
          startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
          endDate={this.state.endDate} // momentPropTypes.momentObj or null,
          endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
          onDatesChange={({ startDate, endDate }) =>
            this.setState({ startDate, endDate })
          } // PropTypes.func.isRequired,
          focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
          noBorder={true}
          showDefaultInputIcon={true}
        />
      </div>
    );
  }
}

export default withStyles(styles)(CalendarPicker);