import { execSync } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Episode } from './types';

async function getPythonCommand(): Promise<string> {
  // Try different Python commands
  const commands = ['python3', 'python', 'py'];
  for (const cmd of commands) {
    try {
      execSync(`${cmd} --version`, { stdio: 'pipe' });
      return cmd;
    } catch (e) {
      continue;
    }
  }
  throw new Error('No Python interpreter found. Please install Python 3.');
}

async function updateEpisodes() {
  try {
    // Find Python interpreter
    const pythonCmd = await getPythonCommand();
    console.log(`Using Python command: ${pythonCmd}`);

    // Get script paths - use src directory instead of dist
    const rootDir = path.join(__dirname, '../..');
    const pythonDir = path.join(rootDir, 'src/scripts/python');
    const requirementsPath = path.join(pythonDir, 'requirements.txt');
    
    // Ensure python directory exists
    try {
      await fs.access(pythonDir);
    } catch (err) {
      throw new Error(`Python scripts directory not found at ${pythonDir}. Please ensure the directory exists and contains required files.`);
    }

    // Install Python dependencies
    try {
      console.log('Installing Python dependencies...');
      execSync(`${pythonCmd} -m pip install -r "${requirementsPath}"`, { 
        stdio: 'inherit',
        encoding: 'utf-8'
      });
    } catch (err) {
      console.error('Failed to install Python dependencies:', err);
    }

    // Get the current year
    const currentYear = new Date().getFullYear().toString();
    
    // Run the Python script for current year
    const pythonScript = path.join(pythonDir, 'gtwmparse.py');
    console.log(`Fetching episodes for year ${currentYear}...`);
    
    try {
      await fs.access(pythonScript);
    } catch (err) {
      throw new Error(`Python script not found at ${pythonScript}. Please ensure the file exists.`);
    }

    execSync(`${pythonCmd} "${pythonScript}" ${currentYear}`, { 
      stdio: 'inherit',
      cwd: pythonDir
    });

    // The Python script creates gtwm_episodes_YEAR.json in the python directory
    const tempJsonFile = path.join(pythonDir, `gtwm_episodes_${currentYear}.json`);
    const targetJsonFile = path.join(rootDir, 'src/data', `${currentYear}.json`);

    // Ensure the data directory exists
    const dataDir = path.dirname(targetJsonFile);
    await fs.mkdir(dataDir, { recursive: true });

    // Read the generated JSON file
    let newEpisodes: Episode[] = [];
    try {
      const content = await fs.readFile(tempJsonFile, 'utf-8');
      newEpisodes = JSON.parse(content);
    } catch (err: any) {
      throw new Error(`Failed to read generated episodes file: ${err?.message || err}`);
    }

    // Read existing episodes if any
    let existingEpisodes: Episode[] = [];
    try {
      const existingContent = await fs.readFile(targetJsonFile, 'utf-8');
      existingEpisodes = JSON.parse(existingContent);
    } catch (err) {
      // File doesn't exist yet, that's fine
      console.log('No existing episodes file found, creating new one.');
    }

    // Merge episodes, avoiding duplicates
    const updatedEpisodes = [...existingEpisodes];
    let newEpisodesCount = 0;
    for (const episode of newEpisodes) {
      const exists = existingEpisodes.some(
        e => e['episode title'] === episode['episode title'] && e.date === episode.date
      );
      if (!exists) {
        updatedEpisodes.push(episode);
        newEpisodesCount++;
      }
    }

    // Sort episodes by date (oldest first)
    updatedEpisodes.sort((a, b) => {
      const dateA = new Date(a.date.replace(/(\d+)(?:st|nd|rd|th)?,/, "$1,"));
      const dateB = new Date(b.date.replace(/(\d+)(?:st|nd|rd|th)?,/, "$1,"));
      return dateA.getTime() - dateB.getTime();
    });

    // Write to the data directory
    await fs.writeFile(targetJsonFile, JSON.stringify(updatedEpisodes, null, 2));
    console.log(`Added ${newEpisodesCount} new episodes to ${currentYear}.json`);

    // Clean up temporary files
    try {
      await fs.unlink(tempJsonFile);
      const tempTxtFile = path.join(pythonDir, `gtwm_episodes_${currentYear}.txt`);
      await fs.unlink(tempTxtFile).catch(() => {}); // Ignore if txt file doesn't exist
    } catch (err) {
      console.warn('Warning: Failed to clean up temporary files:', err);
    }

    // Run the site generator
    console.log('Rebuilding site...');
    execSync('npm run build', { stdio: 'inherit' });

    console.log('Episodes updated and site rebuilt successfully');
  } catch (error: any) {
    console.error('Error updating episodes:', error?.message || error);
    process.exit(1);
  }
}

updateEpisodes().catch(console.error);