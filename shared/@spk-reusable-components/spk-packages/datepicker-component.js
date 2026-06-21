import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const SpkDatepickr = ({
  selected,
  onChange,
  dateFormat = 'dd/MM/yyyy',
  showTimeSelect = false,
  timeFormat = 'HH:mm',
  timeIntervals = 30,
  minDate,
  maxDate,
  Timeinput,
  isClearable,
  placeholderText = 'Select a date',
  className = '',
  disabled = false,
  Iconvisible ,
  showTimeSelectOnly ,
  showTimeInput ,
  Localtime ,
  Caption ,
  Inline,
  Yearpicker,
  selectsRange,
  startDate,
  endDate,
  ...props
}) => {
  return (
    <DatePicker
      selected={selected}
      selectsRange={selectsRange}
      startDate={startDate}
      endDate={endDate}
      onChange={onChange}
      dateFormat={dateFormat}
      timeInputLabel={Timeinput}
      showTimeSelect={showTimeSelect}
      timeFormat={timeFormat}
      timeIntervals={timeIntervals}
      showTimeSelectOnly={showTimeSelectOnly}
      minDate={minDate}
      maxDate={maxDate}
      isClearable={isClearable}
      placeholderText={placeholderText}
      className={className}
      disabled={disabled}
      showIcon={Iconvisible}
      inline={Inline}
      showTimeInput={showTimeInput}
      timeCaption={Caption}
      showMonthYearPicker={Yearpicker}
      locale={Localtime}
      {...props} // Forward any additional props to DatePicker
    />
  );
};

export default SpkDatepickr;
