import React, {useState} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Tooltip from '@mui/material/Tooltip';
import './Timeline.scss';
import moment from 'moment';

export const Timeline = (props) => {
 const {title, status, data, numberOfLabels, startTime, endTime, legendItems} = props
      const [dateNow , setDateNow] = useState(new Date())
  const LegendItem = ({ color, label }) => (
    <div className=" align-middle position-relative">
      <div className="legends mx-2" style={{ backgroundColor: color }}></div>
      <span className="legends-title">{label}</span>
    </div>
  );

  const Legend = ({ items }) => (
    <div className="d-flex column gap-5 justify-content-center pt-[3%] pb-3 legend">
      {items.map((item, index) => (
        <LegendItem key={index} color={item.color} label={item.label} />
      ))}
    </div>
  );


  let startDate = new Date(startTime);
  let endDate = new Date(endTime) > dateNow ? dateNow : new Date(endTime);
  
  const totalDuration = endDate - startDate;

  const calculatePosition = (startTime, endTime) => {

    const eventStart = new Date(startTime) - new Date(startDate);
    const eventEnd = new Date(endTime) - new Date(startDate);
    const left = (eventStart / totalDuration) * 100;
    const width = ((eventEnd - eventStart) / totalDuration) * 100;
    return { left, width };
    
  };

  const timeLabels = [];
  const lineLabels = [];
  const labelInterval = totalDuration / numberOfLabels; // You can adjust the number of labels as needed

  for (let i = 0; i <= totalDuration; i += labelInterval) {
    const currentTime = new Date(startDate.getTime() + i);
    const left = (i / totalDuration) * 100;
    timeLabels.push(
      <div key={`label-${i}`} className="time-label" style={{ left: `${left}%` }}>
        <div>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    );

    lineLabels.push(
      <div key={`label-${i}`} className="time-label" style={{ left: `${left}%` }}>
        <span className="line"></span>
      </div>
    );
  }

  return (
    <>
      <div className="timeline-container d-flex p-2">
        <div className="d-flex justify-content-between py-3 px-2">
          <div className="dt-heading col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <div className='d-flex'>
            <div className='dt-card-title'>
            {title}
            </div>
            <div className='px-4'>
          {status}
             </div>
             </div>
          </div>
          <div className="ml-auto col-lg-4 col-md-5 col-sm-12 align-end">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              disabled
              className="date-picker"
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          </div>
        </div>
        <div className="timeline">
          {data.map((item, index) => {
            let color;

                const { left, width } = calculatePosition(
                  moment.utc(item.startTime).format('YYYY-MM-DD HH:mm:ss'),
                  moment.utc(item.endTime).format('YYYY-MM-DD HH:mm:ss')
                );

                if (item.Category === 'Category2') color = 'red';
                else if (item.Category === 'Category1') color = 'blue';
                else color = 'black';

                return (
                  <>
                    <Tooltip
                      title={`${moment.utc(item.startTime).format('LLL')} to ${moment
                        .utc(item.endTime)
                        .format('LLL')}`}
                    >
                      <div
                        key={index}
                        className="event"
                        style={{
                          left: `${left}%`,
                          width: `${width}%`,
                          backgroundColor: color
                        }}
                      ></div>
                    </Tooltip>
                  </>
                );
              
                      }
         
          )}
        </div>
        <div className="time-labels ps-1 pe-3">{timeLabels}</div>
        <div className="line-labels">{lineLabels}</div>
        <div className="line2-labels">{lineLabels}</div>
      </div>

      <Legend items={legendItems} />
    </>
  );
};
