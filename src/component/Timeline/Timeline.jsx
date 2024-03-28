import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Tooltip from '@mui/material/Tooltip';
import './Timeline.scss';
import moment from 'moment';

export const Timeline = (props) => {
  console.log(props.downtimeData)
  const LegendItem = ({ color, label }) => (
    <div className="d-flex align-middle position-relative">
      <div className="legends mx-2" style={{ backgroundColor: color }}></div>
      <span className="legends-title">{label}</span>
    </div>
  );

  const Legend = ({ items }) => (
    <div className="d-flex gap-5 justify-content-center py-3">
      {items.map((item, index) => (
        <LegendItem key={index} color={item.color} label={item.label} />
      ))}
    </div>
  );

  const legendItems = [
    { color: 'var(--secondary1)', label: 'Planned' },
    { color: 'var(--danger)', label: 'Unplanned' },
    { color: 'var(--grey-dark)', label: 'Untagged' }
  ];

  let startDate = new Date(props.startTime);
  let endDate = new Date(props.endTime) > new Date() ? new Date() : new Date(props.endTime);
  const downtimeData = props.downtimeData;
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
  const labelInterval = totalDuration / 10; // You can adjust the number of labels as needed

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
            {props.machineId} -{' '}
            {downtimeData[downtimeData.length - 1]?.status === 'RUNNING' ? 'Idle' : 'Running'}
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
          {downtimeData.map((item, index) => {
            let color;
            if (item.reason?.length > 0) {
              return item.reason?.map((item2, index) => {
                const { left, width } = calculatePosition(
                  moment.utc(item2.startTime).format('YYYY-MM-DD HH:mm:ss'),
                  moment.utc(item2.endTime).format('YYYY-MM-DD HH:mm:ss')
                );

                if (item2.reasonCat === 'Un Planned') color = 'var(--danger)';
                else if (item2.reasonCat === 'Planned') color = 'var(--secondary1)';
                else color = 'var(--grey-dark)';

                return (
                  <>
                    <Tooltip
                      title={`${moment.utc(item2.startTime).format('LLL')} to ${moment
                        .utc(item2.endTime)
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
              });
            } else if (item.reason?.length === 0) {
              const { left, width } = calculatePosition(item.startTime, item.endTime);
              // let color;
              color = 'var(--grey-dark)';
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
          })}
        </div>
        <div className="time-labels ps-1 pe-3">{timeLabels}</div>
        <div className="line-labels">{lineLabels}</div>
        <div className="line2-labels">{lineLabels}</div>
      </div>

      <Legend items={legendItems} />
    </>
  );
};
