import type { FormProps } from 'antd'
import { Button, Form, Input, InputNumber } from 'antd'
import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { useGlobalConfig, useGlobalDevtools } from '@/core/globalStore.ts'
import { defaultGameConfig } from '@/core/gameConfig.ts'

const Config: React.FC = () => {
  useGlobalDevtools()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const {
    customConfig,
    setCustomConfig,
    setGameConfig,
    resetConfig,
  } = useGlobalConfig()

  const initConfig = {
    randomAreaNum: 2,
    randomBlockNum: 8,
    animalStr: defaultGameConfig.animals.join(''),
    ...customConfig,
  }

  const [config] = useState(initConfig)

  /**
   * 回到上一页
   */
  const goBack = () => {
    navigate(-1)
  }

  // 重置表单
  const onResetForm = () => {
    form.resetFields()
  }

  // 初始化自定义配置参数
  const onResetConfig = () => {
    resetConfig()
    // 刷新当前页
    navigate(0)
  }

  const onFinish: FormProps<typeof config>['onFinish'] = (values) => {
    console.log('Success:', values)
    const temp = { ...values }
    temp.randomBlocks = Array.from<number>({ length: values.randomAreaNum }).fill(
      values.randomBlockNum,
    )
    if (values.animalStr) {
      temp.animals = Array.from(values.animalStr)
    }
    setGameConfig(temp)
    setCustomConfig(temp)
    navigate('/game')
  }

  const onFinishFailed: FormProps<typeof config>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <>
      <div className="flex flex-wrap-reverse">
        <div className="flex flex-1 justify-center items-center">
          <span className="text-2xl text-center">
            自定义难度
          </span>
        </div>
        <Button size="small" onClick={goBack}>
          返回
        </Button>
      </div>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={config}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form}
      >
        <Form.Item<typeof config>
          label="槽容量"
          name="slotNum"
          rules={[{ required: true, type: 'number', message: '请输入槽容量(数字)' }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item<typeof config>
          label="合成数"
          name="composeNum"
          rules={[{ required: true, type: 'number', message: '请输入合成数(数字)' }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="动物数"
          name="typeNum"
          rules={[{ required: true, type: 'number', message: '请输入动物数(数字)' }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item<typeof config>
          label="动物图案"
          name="animalStr"
          rules={[{ required: true, type: 'string', message: '请输入动物图案' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<typeof config>
          label="总层数"
          name="levelNum"
          rules={[{ required: true, type: 'number', message: '请输入总层数(数字)' }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item<typeof config>
          label="每层块数"
          name="levelBlockNum"
          rules={[{ required: true, type: 'number', message: '请输入每层块数(数字)' }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item<typeof config>
          label="边界收缩"
          name="borderStep"
          rules={[{ required: true, type: 'number', message: '请输入边界收缩(数字)' }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item<typeof config>
          label="随机区数"
          name="randomAreaNum"
          rules={[{ required: true, type: 'number', message: '请输入随机区数(数字)' }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="随机区块数"
          name="randomBlockNum"
          rules={[{ required: true, type: 'number', message: '请输入随机区块数(数字)' }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-between">
            <Button type="primary" htmlType="submit">
              开始游戏
            </Button>
            <Button danger onClick={onResetForm}>
              重置
            </Button>
            <Button onClick={onResetConfig}>
              还原到默认配置
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  )
}

export default Config
