import os
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def generate_streaming_response(messages):
    """
    Generating streaming response from openAI, gives results in chunks, sending in role (user or assistant) and then the content

    """
    try:
        response = await client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            stream=True,
            max_tokens=1000
        )

        async for chunk in response:
            content = chunk.choices[0].delta.content
            if content:
                yield content
    except Exception as e:
        yield f"Error: {str(e)}"