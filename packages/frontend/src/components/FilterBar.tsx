import React from 'react';
import { Select, DatePicker, Button, Flex } from 'antd';
import type { Application } from '../types';

const { RangePicker } = DatePicker;

interface FilterBarProps {
  applications: Application[];
  selectedAppId?: string;
  onAppChange: (appId: string | undefined) => void;
  dateRange: [string | undefined, string | undefined];
  onDateChange: (range: [string | undefined, string | undefined]) => void;
  onReset: () => void;
  onExport?: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  applications,
  selectedAppId,
  onAppChange,
  dateRange: _dateRange,
  onDateChange,
  onReset,
  onExport,
}) => {
  return (
    <Flex
      wrap="wrap"
      gap={12}
      align="center"
      style={{ marginBottom: 16 }}
    >
      <Select
        placeholder="All applications"
        allowClear
        value={selectedAppId}
        onChange={(val) => onAppChange(val)}
        style={{ minWidth: 200 }}
        options={applications.map((app) => ({
          label: app.name,
          value: app.id,
        }))}
      />
      <RangePicker
        onChange={(dates) => {
          if (dates && dates[0] && dates[1]) {
            onDateChange([dates[0].toISOString(), dates[1].toISOString()]);
          } else {
            onDateChange([undefined, undefined]);
          }
        }}
      />
      <Button onClick={onReset}>Reset</Button>
      {onExport && (
        <Button type="primary" onClick={onExport}>
          Export
        </Button>
      )}
    </Flex>
  );
};

export default FilterBar;
