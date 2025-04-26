import sys
import feedparser
import ssl
import re
from datetime import datetime
from typing import List
import json

# Constants
RSS_URL = "https://anchor.fm/s/4555b94c/podcast/rss"
DATE_FORMAT = '%a, %d %b %Y %H:%M:%S %Z'

def setup_ssl_context() -> None:
    """Configure SSL context for feed parsing."""
    if hasattr(ssl, '_create_unverified_context'):
        ssl._create_default_https_context = ssl._create_unverified_context

def clean_summary(text: str) -> str:
    """Clean HTML and special characters from summary text."""
    
    # List of phrases or patterns to remove
    removal_phrases = [
        r'(<.*?>)',                    # Remove HTML tags
        r'(&nbsp;)',                   # Remove &nbsp;
        r'(Powered by.*)',             # Remove "Powered by ..." and anything after
        r'(--- .*)',                   # Remove "--- ..." lines
        r'(BingoPlus!.*)',              # Remove BingoPlus! lines
        r'(GTWM has a new sponsor!.*)', # Remove GTWM sponsor lines
        r'(We will see you on another episode of GTWM tomorrow.*)', # Remove outro
        r'(\?*\s*Who doesn’t want to have fun and enjoy exciting games.*)' # Your new rule
    ]
    
    # Build the compiled regex pattern
    pattern = re.compile('|'.join(removal_phrases), re.DOTALL)
    
    # Remove unwanted content using the pattern
    text = re.sub(pattern, '', text)
    
    # Clean quote marks (&quot;) to normal quotes
    quote_clean = re.compile('(&quot;)')
    return re.sub(quote_clean, '"', text)

def get_episodes_by_year(feed: dict, year: int) -> List[str]:
    """Extract episodes for a specific year from feed."""
    episodes = []
    
    for entry in feed.entries:
        published_date = datetime.strptime(entry.published, DATE_FORMAT)
        
        if published_date.year == year:
            episode = f"{entry.title}\n{entry.published}\n{entry.itunes_duration}\n{clean_summary(entry.summary)}"
            episodes.append(episode)
    
    return episodes
def parse_published_date(raw_date: str) -> datetime | None:
    formats_to_try = [
        "%B %d, %Y",                 # June 10, 2019
        "%a, %d %b %Y %H:%M:%S %Z",  # Mon, 25 Jan 2021 22:18:09 GMT
        "%Y-%m-%dT%H:%M:%SZ",        # Optional ISO
    ]
    for fmt in formats_to_try:
        try:
            return datetime.strptime(raw_date, fmt)
        except ValueError:
            continue
    print(f"⚠️ Could not parse date: {raw_date}")
    return None

def extract_callers(summary: str) -> tuple[list[str], str]:
    """Extract caller information from summary and return callers list and cleaned summary.
    Each caller entry includes their full description until the next caller or end of text."""
    # Split by 'Caller #' but keep the delimiter
    parts = re.split(r'(Caller #\d+)', summary)
    
    callers = []
    cleaned_parts = []
    
    if parts[0] and not parts[0].startswith('Caller #'):
        cleaned_parts.append(parts[0])
    
    # Process each part after splitting
    i = 1
    while i < len(parts) - 1:
        caller_num = parts[i]  # This is 'Caller #X'
        description = parts[i + 1]  # This is the text until the next caller
        
        # Combine caller number with their description
        full_caller = (caller_num + description).strip()
        callers.append(full_caller)
        i += 2
    
    # The last part might be a caller description
    if i < len(parts):
        last_part = parts[i]
        if last_part.startswith('Caller #'):
            callers.append(last_part.strip())
        else:
            cleaned_parts.append(last_part)
    
    # Join the non-caller parts for the cleaned summary
    cleaned_summary = ' '.join(cleaned_parts).strip()
    cleaned_summary = ' '.join(cleaned_summary.split())  # Clean up whitespace
    
    return callers, cleaned_summary

def save_episodes_to_json(episodes: List[str], year: int, filename: str = None) -> None:
    """Save episodes to a JSON file with structured data."""
    if filename is None:
        filename = f"gtwm_episodes_{year}.json"
    
    structured_episodes = []
    for episode in reversed(episodes):
        # Split the episode string into its components
        title, date, duration, *summary_parts = episode.split('\n')
        # Rejoin summary parts in case summary contained newlines
        summary = '\n'.join(summary_parts)
        
        # Extract callers and clean summary
        callers, cleaned_summary = extract_callers(summary)
        
        # Clean up the summary by replacing \n with <br> for better HTML display
        cleaned_summary = cleaned_summary.replace('\n', '<br>')
        
        try:
            parsed_date = parse_published_date(date.strip())
            formatted_date = parsed_date.strftime("%B %d, %Y") if parsed_date else date.strip()
        except Exception as e:
            print(f"⚠️ Failed to format date: {date.strip()} ({e})")
            formatted_date = date.strip()
        
        episode_data = {
            "episode title": title.strip(),
            "date": formatted_date.strip(),
            "duration": duration.strip(),
            "callers": callers,
            "summary": cleaned_summary.strip()
        }
        structured_episodes.append(episode_data)
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(structured_episodes, f, indent=2, ensure_ascii=False)
    
    print(f"\nEpisodes saved to {filename}")

def save_episodes_to_txt(episodes: List[str], year: int, filename: str = None) -> None:
    """Save episodes to a text file."""
    if filename is None:
        filename = f"gtwm_episodes_{year}.txt"
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(f"GTWM Episodes - {year}\n")
        f.write("=" * 50 + "\n\n")
        
        for episode in reversed(episodes):
            f.write(episode)
            f.write("\n" + "-" * 50 + "\n\n")
    
    print(f"\nEpisodes saved to {filename}")

def main(year: str) -> None:
    """Main function to process podcast feed."""
    try:
        year = int(year)
        setup_ssl_context()
        
        feed = feedparser.parse(RSS_URL)
        print(f"{feed['feed']['title']}\n")
        
        episodes = get_episodes_by_year(feed, year)
        
        if not episodes:
            print(f"No episodes found for year {year}")
            return
            
        print(f"Processing episodes for year: {year}")
        for episode in reversed(episodes):
            print(episode)
        
        # Save episodes to both JSON and text files
        save_episodes_to_json(episodes, year)
        save_episodes_to_txt(episodes, year)
            
    except ValueError:
        print("Error: Year must be a valid number")
    except Exception as e:
        print(f"Error processing feed: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <year>")
    else:
        main(sys.argv[1])