// 简单的API测试脚本
const testAPI = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: '测试周报生成功能',
        api_key: 'test-key'
      })
    });

    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const text = await response.text();
      console.log('Response:', text);
    } else {
      const error = await response.text();
      console.log('Error:', error);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
};

testAPI();