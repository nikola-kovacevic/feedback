import React, { useState } from 'react';
import { Button, Typography, theme, App } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface EmbedSnippetProps {
  apiKey: string;
  mode?: 'floating' | 'inline';
}

const EmbedSnippet: React.FC<EmbedSnippetProps> = ({ apiKey, mode = 'floating' }) => {
  const { token } = theme.useToken();
  const { message } = App.useApp();
  const [copied, setCopied] = useState(false);

  const backendOrigin = window.location.origin;

  const snippet = mode === 'floating'
    ? `<script src="${backendOrigin}/widget/feedback.js"></script>
<script>
  FeedbackWidget.init({
    apiKey: '${apiKey}',
  });
</script>`
    : `<div id="feedback-container"></div>
<script src="${backendOrigin}/widget/feedback.js"></script>
<script>
  FeedbackWidget.render({
    apiKey: '${apiKey}',
    target: '#feedback-container',
  });
</script>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      message.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      message.error('Failed to copy');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text strong>Embed Snippet</Text>
        <Button
          size="small"
          icon={copied ? <CheckOutlined /> : <CopyOutlined />}
          onClick={handleCopy}
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <pre
        style={{
          background: token.colorBgLayout,
          border: `1px solid ${token.colorBorder}`,
          borderRadius: token.borderRadius,
          padding: 16,
          fontSize: 13,
          overflow: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          margin: 0,
        }}
      >
        {snippet}
      </pre>
    </div>
  );
};

export default EmbedSnippet;
