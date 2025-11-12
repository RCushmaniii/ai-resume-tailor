"""
fetch_and_clean_jd.py - Module for fetching and cleaning job descriptions from URLs
"""
import requests
from bs4 import BeautifulSoup
from typing import Optional
import re
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def fetch_and_clean_jd(url: str) -> Optional[str]:
    """
    Fetches a job description from a URL and cleans the HTML to extract plain text.
    
    Args:
        url (str): URL of the job description page
        
    Returns:
        str or None: Cleaned job description text or None if fetching fails
    """
    try:
        logger.info(f"Fetching job description from URL: {url}")
        
        # Check if URL is valid
        if not url.startswith(('http://', 'https://')):
            logger.error(f"Invalid URL format: {url}")
            return None
        
        # Set user agent to avoid being blocked
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        
        # Fetch the URL content
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # Raise exception for 4XX/5XX responses
        
        # Parse HTML with BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove script and style elements
        for script_or_style in soup(['script', 'style', 'head', 'header', 'footer', 'nav']):
            script_or_style.extract()
        
        # Extract text from HTML
        text = soup.get_text()
        
        # Clean up the text
        # Replace multiple newlines with a single newline
        text = re.sub(r'\n+', '\n', text)
        # Replace multiple spaces with a single space
        text = re.sub(r'\s+', ' ', text)
        # Remove leading/trailing whitespace
        text = text.strip()
        
        # Try to extract the job description section if possible
        # This is a simple heuristic and may need to be adjusted for specific sites
        job_desc_indicators = [
            "job description", "job summary", "about the job", 
            "position summary", "responsibilities", "requirements",
            "qualifications", "what you'll do", "about the role"
        ]
        
        # Try to find sections that might contain the job description
        lower_text = text.lower()
        for indicator in job_desc_indicators:
            if indicator in lower_text:
                # Find the approximate position of the job description section
                pos = lower_text.find(indicator)
                if pos > 0:
                    # Take a chunk of text starting from the indicator
                    # This is a simple approach and might need refinement
                    text = text[pos:pos + 5000]  # Take up to 5000 chars after the indicator
                    break
        
        # Limit to a reasonable length (10,000 chars max)
        if len(text) > 10000:
            logger.info(f"Job description truncated from {len(text)} to 10000 characters")
            text = text[:10000]
        
        logger.info(f"Successfully fetched and cleaned job description: {len(text)} characters")
        return text
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching URL {url}: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Error processing job description: {str(e)}")
        return None


def is_valid_url(url: str) -> bool:
    """
    Checks if a URL is valid.
    
    Args:
        url (str): URL to check
        
    Returns:
        bool: True if URL is valid, False otherwise
    """
    pattern = re.compile(
        r'^(?:http|https)://'  # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|'  # domain
        r'localhost|'  # localhost
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # or ipv4
        r'(?::\d+)?'  # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    return bool(pattern.match(url))


if __name__ == "__main__":
    # Example usage
    test_url = "https://www.example.com/job/software-engineer"
    result = fetch_and_clean_jd(test_url)
    if result:
        print(f"Successfully fetched and cleaned job description ({len(result)} chars)")
        print(result[:200] + "...")  # Print first 200 chars
    else:
        print("Failed to fetch job description")
