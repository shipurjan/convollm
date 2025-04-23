# convollm

A command-line tool for converting chat conversations from various platforms to a standardized JSON format that's friendly for LLM context.

## Installation

```bash
npm i -g convollm
```

## Features

- Convert Discord chat exports to standardized JSON
- Convert Telegram chat exports to standardized JSON
- Convert Instagram chat exports to standardized JSON
- Preserves message references, reactions, and timestamps
- Consistent role assignment for speakers
- Intelligent filtering of notification messages

## Usage

### Discord Conversion

Convert Discord chat logs exported with [DiscordChatExporter](https://github.com/Tyrrrz/DiscordChatExporter):

```bash
convollm convert discord -i path/to/discord-export.json -o output.json
```

### Telegram Conversion

Convert Telegram chat logs exported from Telegram Desktop:

```bash
convollm convert telegram -i path/to/telegram-export.json -o output.json
```

### Instagram Conversion

Convert Instagram chat logs from your Instagram data export:

```bash
convollm convert instagram -i path/to/message_1.json -o output.json
```

## Output Format

The tool generates a standardized JSON format with the following structure:

```json
[
  {
    "id": "msg-000001",
    "date": "01-Mar-2023 14:30",
    "role": "speaker1",
    "name": "User Name",
    "content": "Message content here",
    "reaction": "👍",
    "repliedTo": "msg-000000"
  }
  // More messages...
]
```

### Output Fields

| Field     | Description                                               |
| --------- | --------------------------------------------------------- |
| id        | Unique message identifier                                 |
| date      | Formatted message timestamp (DD-MMM-YYYY HH:MM)           |
| role      | Consistent speaker role (speaker1, speaker2, etc.)        |
| name      | Original username from the chat                           |
| content   | Message text content                                      |
| reaction  | Optional emoji reaction (if present)                      |
| repliedTo | Optional reference to replied message ID (if present)     |
| embed     | Optional embed title (Discord only, if present)           |
| mediaPath | Optional path to media file (Telegram only, if present)   |
| mediaType | Optional media type (for messages with media)             |
| shareLink | Optional shared link URL (Instagram only, if present)     |
| shareText | Optional shared content text (Instagram only, if present) |

## Platform-Specific Features

### Instagram Conversion

The Instagram converter includes:

- Preservation of Unicode characters and emojis
- Automatic filtering of reaction notification messages
- Support for photos and shared content
- Reversal of message order (Instagram exports newest-first)

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/convollm.git
cd convollm

# Install dependencies
npm install

# Build the project
npm run build
```

### Commands

- `npm run dev` - Watch mode for development
- `npm run build` - Build the project
- `npm start` - Run the built project

## License

MIT © Cyprian Zdebski
