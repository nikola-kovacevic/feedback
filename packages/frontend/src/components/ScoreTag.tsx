import React from 'react';
import { Tag } from 'antd';
import { theme } from 'antd';

interface ScoreTagProps {
  score: number;
}

const ScoreTag: React.FC<ScoreTagProps> = ({ score }) => {
  const { token } = theme.useToken();

  let color: string;
  if (score >= 9) {
    color = token.colorSuccess;
  } else if (score >= 7) {
    color = token.colorPrimary;
  } else {
    color = token.colorError;
  }

  return <Tag color={color}>{score}</Tag>;
};

export default ScoreTag;
