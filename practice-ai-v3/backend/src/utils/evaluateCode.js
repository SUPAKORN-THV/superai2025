import { exec } from 'child_process';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export default function evaluateCode(userCode, expectedCode, language = 'javascript') {
  return new Promise((resolve) => {
    const tmpDir = path.join('/tmp', uuidv4());
    fs.mkdirSync(tmpDir);
    const filePath = path.join(tmpDir, `index.${language === 'javascript' ? 'js' : 'py'}`);
    fs.writeFileSync(filePath, userCode);

    exec(`node ${filePath}`, { timeout: 5000 }, (err, stdout) => {
      // expectedCode is a string representation of JavaScript that returns expected output
      let expected;
      try {
        // eslint-disable-next-line no-eval
        expected = eval(expectedCode);
      } catch (e) {
        expected = undefined;
      }
      const output = (stdout || '').trim();
      resolve({ passed: String(output) === String(expected), output, expected });
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });
  });
}