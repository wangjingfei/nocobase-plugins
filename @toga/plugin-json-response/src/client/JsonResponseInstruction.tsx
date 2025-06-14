import React from 'react';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/css';
import { Select, Input, Checkbox, Form, Card, Radio } from 'antd';
import { useForm } from '@formily/react';

const parseModeOptions = [
  { value: 'jsonPath', label: 'JSONPath' },
  { value: 'direct', label: 'Direct' }
];

export const JsonResponseInstruction = () => {
  const { t } = useTranslation();
  const form = useForm();

  return (
    <Card
      title={t('JSON响应解析配置')}
      className={css`
        width: 100%;
        margin-bottom: 16px;
      `}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
      >
        <Form.Item
          name="responseData"
          label={t('响应数据')}
          tooltip={t('上游HTTP请求节点的响应数据字段名，默认为 "data"')}
        >
          <Input placeholder={t('默认为 "data"')} />
        </Form.Item>

        <Form.Item
          name="parseMode"
          label={t('解析模式')}
          tooltip={t('选择如何解析JSON数据')}
        >
          <Radio.Group options={parseModeOptions} />
        </Form.Item>

        <Form.Item
          name="pathExpression"
          label={t('路径表达式')}
          tooltip={t('使用JSONPath语法从响应数据中提取特定值，例如 "$.data.items[0].id"')}
        >
          <Input placeholder={t('例如: $.data.items[0].id')} />
        </Form.Item>

        <Form.Item
          name="outputField"
          label={t('输出字段')}
          tooltip={t('解析结果将存储在此变量中，供下游节点使用')}
        >
          <Input placeholder={t('例如: parsedData')} />
        </Form.Item>

        <Form.Item
          name="fallbackValue"
          label={t('默认值')}
          tooltip={t('当解析结果为空时使用的默认值')}
        >
          <Input placeholder={t('可选')} />
        </Form.Item>

        <Form.Item
          name="continueOnError"
          valuePropName="checked"
          wrapperCol={{ offset: 6, span: 18 }}
          tooltip={t('如果启用，即使解析出错，工作流也将继续执行')}
        >
          <Checkbox>{t('忽略错误')}</Checkbox>
        </Form.Item>
      </Form>
    </Card>
  );
}; 