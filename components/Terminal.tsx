
import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import Modal from './common/Modal';

interface TerminalProps {
    initialCommand?: string;
}

const Terminal: React.FC<TerminalProps> = ({ initialCommand }) => {
    const [vfs, setVfs] = useState<Record<string, string[]>>({
        '/home/admin': ['docs', 'projects', 'logs', 'bin'],
        '/home/admin/docs': ['manual.pdf', 'network_schema.txt'],
        '/home/admin/projects': ['ar-control-v3'],
        '/home/admin/projects/ar-control-v3': ['src', 'package.json', 'README.md'],
        '/bin': ['adb', 'git', 'python', 'bash', 'apt', 'pkg']
    });

    const [outputLines, setOutputLines] = useState<string[]>([
        'AR CONTROL OS [Kernel 5.15.0-android-kali]',
        'System: Linux arm64 (Termux/Kali layer active)',
        'Welcome, Admin. System is in SECURE mode.',
        'Type "help" to see available commands.',
        ''
    ]);
    
    const [currentPath, setCurrentPath] = useState<string>('/home/admin');
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [historyPtr, setHistoryPtr] = useState(-1);
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [outputLines]);

    useEffect(() => {
        if (initialCommand) {
            executeCommand(initialCommand);
        }
    }, [initialCommand]);

    useEffect(() => {
        const timer = setTimeout(() => inputRef.current?.focus(), 300);
        return () => clearTimeout(timer);
    }, [currentPath]);

    const executeCommand = (cmdStr: string) => {
        if (!cmdStr.trim()) {
            setOutputLines(prev => [...prev, `root@ar-control:${currentPath}#`]);
            return;
        }

        setHistory(prev => [cmdStr, ...prev]);
        setHistoryPtr(-1);

        const prompt = `root@ar-control:${currentPath}# ${cmdStr}`;
        const parts = cmdStr.trim().split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        let output: string | string[] = '';

        switch (cmd) {
            case 'help':
                output = [
                    'SISTEMA:', 'ls, cd, pwd, clear, date, whoami, mkdir, touch',
                    'RED/DEV:', 'adb <devices/connect>, network_status, sys_info',
                    'PAQUETES:', 'apt update, pkg install, git clone [url]',
                    'EXEC:', './[script], python [script.py], node [app.js]'
                ];
                break;
            case 'clear':
                setOutputLines([]);
                setInput('');
                return;
            case 'pwd':
                output = currentPath;
                break;
            case 'whoami':
                output = 'root (uid=0)';
                break;
            case 'date':
                output = new Date().toLocaleString();
                break;
            case 'ls':
                output = vfs[currentPath] ? vfs[currentPath].join('    ') : 'Error: Directory unreachable';
                break;
            case 'cd':
                const target = args[0];
                if (!target || target === '~') {
                    setCurrentPath('/home/admin');
                } else if (target === '..') {
                    const pathParts = currentPath.split('/').filter(p => p);
                    pathParts.pop();
                    setCurrentPath('/' + pathParts.join('/'));
                } else {
                    const newPath = (currentPath === '/' ? '/' : currentPath + '/') + target;
                    if (vfs[newPath]) {
                        setCurrentPath(newPath);
                    } else {
                        output = `bash: cd: ${target}: No such directory`;
                    }
                }
                break;
            case 'git':
                if (args[0] === 'clone' && args[1]) {
                    const repoName = args[1].split('/').pop()?.replace('.git', '') || 'new-repo';
                    output = [`Cloning into '${repoName}'...`, 'Receiving objects: 100% (452/452), done.', `SUCCESS: ${repoName} cloned into project tree.`];
                    const currentContents = vfs[currentPath] || [];
                    if (!currentContents.includes(repoName)) {
                        setVfs({
                            ...vfs,
                            [currentPath]: [...currentContents, repoName],
                            [`${currentPath}/${repoName}`.replace(/\/+/g, '/')]: ['src', '.git', 'README.md', 'run.sh']
                        });
                    }
                } else output = 'usage: git clone <url>';
                break;
            case 'adb':
                if (args[0] === 'devices') {
                    output = ['List of devices attached', '192.168.1.105:5555    device', 'emulator-5554         device'];
                } else if (args[0] === 'connect') {
                    output = [`Connecting to ${args[1] || '127.0.0.1'}...`, 'Connected successfully. Session ID: 9021'];
                } else output = 'adb: bridge daemon started successfully on port 5037.';
                break;
            case 'apt':
            case 'pkg':
                output = ['Reading package lists... Done', 'Building dependency tree... Done', 'All system packages are up to date.'];
                break;
            case 'sys_info':
                output = ['OS: AR Control Kali-Layer', 'Kernel: 5.15.0-AArch64', 'Battery: 92% (Charging)', 'Uptime: 2 days, 4 hours'];
                break;
            case 'network_status':
                output = ['wlan0: CONNECTED (192.168.1.105)', 'Signal: -45dBm', 'DNS: 8.8.8.8, 1.1.1.1'];
                break;
            default:
                if (cmd.startsWith('./') || cmd.endsWith('.sh') || cmd.endsWith('.py')) {
                    output = [`[EXEC] Running ${cmd}...`, 'Process ID: ' + Math.floor(Math.random() * 10000), 'Execution completed (exit code 0).'];
                } else output = `bash: ${cmd}: command not found`;
        }

        setOutputLines(prev => [...prev, prompt, ...(Array.isArray(output) ? output : [output]).filter(l => l !== '')]);
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') executeCommand(input);
        else if (e.key === 'ArrowUp') {
            const next = historyPtr + 1;
            if (next < history.length) {
                setHistoryPtr(next);
                setInput(history[next]);
            }
        } else if (e.key === 'ArrowDown') {
            const next = historyPtr - 1;
            if (next >= 0) {
                setHistoryPtr(next);
                setInput(history[next]);
            } else {
                setHistoryPtr(-1);
                setInput('');
            }
        }
    };

    const quickCommands = [
        { label: 'ls', cmd: 'ls' },
        { label: 'cd ..', cmd: 'cd ..' },
        { label: 'adb devices', cmd: 'adb devices' },
        { label: 'git pull', cmd: 'git pull' },
        { label: 'sys info', cmd: 'sys_info' },
        { label: 'clear', cmd: 'clear' }
    ];

    return (
        <div className="h-full flex flex-col bg-[#020202] text-[#00ff41] font-mono text-xs sm:text-sm border border-green-500/20 rounded-lg shadow-2xl overflow-hidden relative group">
            <div className="bg-[#0a0a0a] px-4 py-2 border-b border-green-500/30 flex justify-between items-center shrink-0">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_5px_red]"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_5px_yellow]"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_5px_#00ff41]"></div>
                    <span className="ml-3 text-[10px] text-gray-500 uppercase tracking-widest font-bold">ROOT_SHELL: {currentPath}</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsHelpOpen(true)} className="text-[10px] bg-green-900/30 px-2 py-0.5 rounded border border-green-500/30 hover:bg-green-700/50">MAN</button>
                    <button onClick={() => setOutputLines([])} className="text-[10px] bg-gray-800 px-2 py-0.5 rounded border border-gray-600 hover:bg-gray-700">CLEAR</button>
                </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto cursor-text custom-scrollbar pb-20" onClick={() => inputRef.current?.focus()}>
                {outputLines.map((line, i) => (
                    <div key={i} className="mb-0.5 whitespace-pre-wrap break-all">
                        {line.includes('root@ar-control') ? (
                            <span>
                                <span className="text-green-400 font-bold">root@ar-control</span>
                                <span className="text-white">:</span>
                                <span className="text-blue-400 font-bold">{line.split(':')[1]?.split('#')[0]}</span>
                                <span className="text-white"># {line.split('#')[1]}</span>
                            </span>
                        ) : (
                            <span className={line.includes('Error') || line.includes('found') ? 'text-red-400' : line.includes('SUCCESS') || line.includes('[EXEC]') ? 'text-cyan-400 font-bold' : 'text-green-500/90'}>{line}</span>
                        )}
                    </div>
                ))}
                
                <div className="flex items-start mt-1">
                    <span className="text-green-400 font-bold shrink-0">root@ar-control</span>
                    <span className="text-white mr-0.5 shrink-0">:</span>
                    <span className="text-blue-400 font-bold mr-1 shrink-0">{currentPath}#</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="bg-transparent border-none outline-none text-white w-full p-0 font-mono caret-green-500"
                        autoFocus
                        autoComplete="off"
                        spellCheck="false"
                    />
                </div>
                <div ref={bottomRef} />
            </div>

            {/* Mobile Quick Command Bar */}
            <div className="absolute bottom-0 left-0 w-full bg-black/80 backdrop-blur-md border-t border-green-500/20 p-2 flex overflow-x-auto gap-2 scrollbar-none z-10 lg:opacity-60 lg:hover:opacity-100 transition-opacity">
                {quickCommands.map(qc => (
                    <button
                        key={qc.label}
                        onClick={() => executeCommand(qc.cmd)}
                        className="px-3 py-1 bg-green-900/20 border border-green-500/40 text-green-400 rounded text-[10px] font-bold uppercase whitespace-nowrap hover:bg-green-600 hover:text-white transition-all active:scale-95"
                    >
                        {qc.label}
                    </button>
                ))}
                <div className="ml-auto flex gap-2">
                    <button onClick={() => setInput(prev => prev.slice(0, -1))} className="px-3 py-1 bg-gray-800 text-gray-400 rounded text-[10px]">DEL</button>
                    <button onClick={() => executeCommand(input)} className="px-3 py-1 bg-blue-600 text-white rounded text-[10px] font-bold">RUN</button>
                </div>
            </div>

            <Modal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} title="Manual de Operación de Shell">
                <div className="space-y-4 text-xs font-mono text-gray-300">
                    <div>
                        <h4 className="text-green-400 font-bold mb-1 border-b border-green-900 pb-1 uppercase">Sistema de Archivos</h4>
                        <p><span className="text-white">ls</span> - Listar contenido del directorio actual.</p>
                        <p><span className="text-white">cd [dir]</span> - Cambiar de directorio (soporta .. y ~).</p>
                        <p><span className="text-white">pwd</span> - Mostrar ruta actual.</p>
                    </div>
                    <div>
                        <h4 className="text-blue-400 font-bold mb-1 border-b border-blue-900 pb-1 uppercase">Android & ADB</h4>
                        <p><span className="text-white">adb devices</span> - Ver dispositivos Android vinculados.</p>
                        <p><span className="text-white">adb connect [ip]</span> - Conectar por red puerto 5555.</p>
                    </div>
                    <div>
                        <h4 className="text-purple-400 font-bold mb-1 border-b border-purple-900 pb-1 uppercase">Gestión de Repositorios</h4>
                        <p><span className="text-white">git clone [url]</span> - Descarga un repo al VFS del sistema.</p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Terminal;
