export const searchEngines = [
  {
    id: 'bing',
    label: 'Bing',
    action: 'https://www.bing.com/search?q=',
  },
  {
    id: 'google',
    label: 'Google',
    action: 'https://www.google.com/search?q=',
  },
  {
    id: 'github',
    label: 'GitHub',
    action: 'https://github.com/search?q=',
  },
  {
    id: 'fofa',
    label: 'FOFA',
    action: 'https://fofa.info/result?qbase64=',
    encode: 'base64',
  },
]

export const quickFilters = ['安全平台', '漏洞专区', '在线工具', '社工专区', 'SRC众测']

// 后续维护导航链接时，在对应分类的 resources 数组中追加 resource(...) 即可。
export const navigationSections = [
  {
    id: 'platform',
    name: '安全平台',
    icon: 'ShieldCheck',
    description: '安全社区、行业资讯和公开知识平台。',
    accent: '#111827',
    resources: [
      resource('T00ls论坛', 'https://www.t00ls.com/', 't00ls.com', 'Web 安全与漏洞研究社区。', ['社区', '安全平台'], 'T00ls'),
      resource('奇安信攻防社区', 'https://forum.butian.net/', 'forum.butian.net', '攻防文章、漏洞复现与安全专题。', ['社区', '攻防'], '社区'),
      resource('CT Stack 安全社区', 'https://stack.chaitin.com/', 'stack.chaitin.com', '长亭安全技术社区。', ['社区', '研究'], 'CT'),
      resource('SecQuan', 'https://www.secquan.org/', 'secquan.org', '安全圈资讯与技术聚合。', ['资讯', '社区'], 'Sec'),
      resource('先知社区', 'https://xz.aliyun.com/', 'xz.aliyun.com', '阿里云先知安全技术社区。', ['社区', '漏洞'], '先知'),
      resource('FreeBuf', 'https://www.freebuf.com/', 'freebuf.com', '国内网络安全行业资讯与技术文章。', ['资讯', '安全'], '资讯'),
      resource('漏洞银行', 'https://www.bugbank.cn/', 'bugbank.cn', '漏洞提交、漏洞管理与安全服务。', ['漏洞', '平台'], 'Bug'),
      resource('51CTO-安全', 'https://www.51cto.com/sec/', '51cto.com', '安全专栏与技术文章。', ['文章', '安全'], '51'),
      resource('安全脉搏', 'https://www.secpulse.com/', 'secpulse.com', '安全资讯和技术文章平台。', ['资讯', '文章'], '脉搏'),
      resource('安全客', 'https://www.anquanke.com/', 'anquanke.com', '安全技术文章与活动资讯。', ['文章', '社区'], '安全客'),
      resource('Seebug洞悉漏洞', 'https://paper.seebug.org/', 'paper.seebug.org', '漏洞分析与安全研究文章。', ['漏洞', '研究'], 'Seebug'),
      resource('ATT&CK矩阵', 'https://attack.mitre.org/', 'attack.mitre.org', '攻击技术、战术与检测映射。', ['矩阵', '检测'], 'ATT&CK'),
      resource('90Sec', 'https://forum.90sec.com/', 'forum.90sec.com', '安全技术交流社区。', ['社区', '安全'], '90Sec'),
      resource('吾爱漏洞', 'https://www.52pojie.cn/', '52pojie.cn', '软件安全、逆向和技术讨论。', ['逆向', '社区'], '吾爱'),
      resource('棱角社区', 'https://forum.ywhack.com/', 'forum.ywhack.com', '安全工具、漏洞分析和经验分享。', ['社区', '工具'], '棱角'),
      resource('安全文摘', 'https://www.sec-wiki.com/', 'sec-wiki.com', '安全资料和文章索引。', ['资料', '安全'], '文摘'),
    ],
  },
  {
    id: 'Github-tools',
    name: '开源工具',
    icon: 'SearchCode',
    description: '常用安全检索、编码、情报与辅助工具。',
    accent: '#425aef',
    resources: [
      resource('CyberChef', 'https://gchq.github.io/CyberChef/', 'gchq.github.io', '编码、解码、哈希和数据处理工作台。', ['编码', '工具'], 'Tool'),
      resource('FOFA', 'https://fofa.info/', 'fofa.info', '网络空间资产测绘与指纹检索。', ['测绘', '资产'], 'FOFA'),
      resource('Shodan', 'https://www.shodan.io/', 'shodan.io', '公网服务和设备搜索引擎。', ['测绘', '端口'], 'Shodan'),
      resource('VirusTotal', 'https://www.virustotal.com/', 'virustotal.com', '文件、URL、哈希与域名信誉分析。', ['样本', '情报'], 'VT'),
      resource('crt.sh', 'https://crt.sh/', 'crt.sh', '证书透明日志查询。', ['证书', '域名'], 'CT'),
      resource('DNSDumpster', 'https://dnsdumpster.com/', 'dnsdumpster.com', 'DNS 和子域名关系查询。', ['DNS', 'OSINT'], 'DNS'),
    ],
  },
  {
    id: 'safe-tools',
    name: '安全工具',
    icon: 'FileCode2',
    description: '漏洞验证、扫描框架、字典与测试工具。',
    accent: '#0f8b8d',
    resources: [
      resource('ProjectDiscovery', 'https://projectdiscovery.io/', 'projectdiscovery.io', 'Nuclei、httpx、subfinder 等自动化工具。', ['扫描', '自动化'], 'PD'),
      resource('SecLists', 'https://github.com/danielmiessler/SecLists', 'github.com', '目录、用户、密码与 Fuzz 字典集合。', ['字典', 'Fuzz'], 'Lists'),
      resource('Metasploit Docs', 'https://docs.metasploit.com/', 'docs.metasploit.com', 'Metasploit 文档与模块开发。', ['渗透', '工具'], 'MSF'),
      resource('PayloadsAllTheThings', 'https://github.com/swisskyrepo/PayloadsAllTheThings', 'github.com', '漏洞测试载荷与绕过技巧集合。', ['Payload', 'GitHub'], 'Payload'),
    ],
  },
  {
    id: 'social',
    name: '社工专区',
    icon: 'UserRoundSearch',
    description: '公开信息收集、泄露查询和基础资料检索。',
    accent: '#7b2cbf',
    resources: [
      resource('Have I Been Pwned', 'https://haveibeenpwned.com/', 'haveibeenpwned.com', '邮箱与密码泄露查询。', ['泄露', '情报'], 'Breach'),
      resource('Hunter.io', 'https://hunter.io/', 'hunter.io', '邮箱发现与企业域名情报。', ['邮箱', 'OSINT'], 'Hunter'),
      resource('Wayback Machine', 'https://web.archive.org/', 'web.archive.org', '历史页面和旧接口回溯。', ['归档', 'OSINT'], 'Archive'),
      resource('BGP Toolkit', 'https://bgp.he.net/', 'bgp.he.net', 'ASN、IP 段和网络关系查询。', ['ASN', '网络'], 'BGP'),
    ],
  },
  {
    id: 'vuln',
    name: '漏洞专区',
    icon: 'Bug',
    description: 'CVE、漏洞库、漏洞利用代码与通告。',
    accent: '#d45113',
    resources: [
      resource('NVD', 'https://nvd.nist.gov/vuln/search', 'nvd.nist.gov', 'CVE、CVSS 和漏洞引用查询。', ['CVE', '漏洞'], 'NVD'),
      resource('CVE Program', 'https://www.cve.org/', 'cve.org', 'CVE 官方记录和编号查询。', ['CVE', '官方'], 'CVE'),
      resource('Exploit-DB', 'https://www.exploit-db.com/', 'exploit-db.com', '公开漏洞利用代码和历史案例。', ['PoC', '漏洞'], 'Exploit'),
      resource('Seebug', 'https://www.seebug.org/', 'seebug.org', '中文漏洞库与漏洞分析。', ['漏洞', '中文'], 'CN'),
      resource('Vulners', 'https://vulners.com/', 'vulners.com', '漏洞、补丁、公告聚合检索。', ['检索', '漏洞'], 'Search'),
    ],
  },
  {
    id: 'online',
    name: '在线工具',
    icon: 'Cog',
    description: '浏览器即可使用的速查和转换工具。',
    accent: '#b08900',
    resources: [
      resource('Regex101', 'https://regex101.com/', 'regex101.com', '正则表达式调试和说明。', ['正则', '工具'], 'Regex'),
      resource('JWT.io', 'https://jwt.io/', 'jwt.io', 'JWT 解码和签名调试。', ['JWT', '工具'], 'JWT'),
      resource('MXToolbox', 'https://mxtoolbox.com/', 'mxtoolbox.com', 'DNS、邮件和黑名单检测。', ['DNS', '邮件'], 'MX'),
      resource('URLScan', 'https://urlscan.io/', 'urlscan.io', 'URL 沙箱扫描和页面行为分析。', ['URL', '沙箱'], 'Scan'),
    ],
  },
  {
    id: 'crack',
    name: '解密专区',
    icon: 'KeyRound',
    description: '哈希、编码、口令和逆向辅助资源。',
    accent: '#386641',
    resources: [
      resource('Hashes.com', 'https://hashes.com/en/decrypt/hash', 'hashes.com', '哈希查询与破解结果检索。', ['Hash', '密码'], 'Hash'),
      resource('CrackStation', 'https://crackstation.net/', 'crackstation.net', '哈希解密和字典查询。', ['Hash', '字典'], 'Crack'),
      resource('Ghidra', 'https://ghidra-sre.org/', 'ghidra-sre.org', '逆向工程分析工具。', ['逆向', '工具'], 'RE'),
    ],
  },
  {
    id: 'arena',
    name: '漏洞靶场',
    icon: 'Flag',
    description: '漏洞练习、CTF 和在线实验环境。',
    accent: '#1d4e89',
    resources: [
      resource('PortSwigger Academy', 'https://portswigger.net/web-security', 'portswigger.net', 'Web 安全实验和课程。', ['Web', '靶场'], 'Lab'),
      resource('TryHackMe', 'https://tryhackme.com/', 'tryhackme.com', '安全学习路径和实验房间。', ['学习', '靶场'], 'Room'),
      resource('Hack The Box', 'https://www.hackthebox.com/', 'hackthebox.com', '攻防靶机和安全训练。', ['靶场', '攻防'], 'HTB'),
      resource('CTFtime', 'https://ctftime.org/', 'ctftime.org', 'CTF 赛事日历和排名。', ['CTF', '赛事'], 'CTF'),
    ],
  },
  {
    id: 'anonymous',
    name: '匿名专区',
    icon: 'Send',
    description: '匿名访问、隐私保护和网络测试资料。',
    accent: '#64748b',
    resources: [
      resource('Tor Project', 'https://www.torproject.org/', 'torproject.org', '匿名网络和隐私浏览。', ['匿名', '隐私'], 'Tor'),
      resource('Privacy Guides', 'https://www.privacyguides.org/', 'privacyguides.org', '隐私保护软件和方案。', ['隐私', '指南'], 'Guide'),
      resource('Tails', 'https://tails.net/', 'tails.net', '便携式隐私操作系统。', ['系统', '隐私'], 'Tails'),
    ],
  },
  {
    id: 'blog',
    name: '优秀博客',
    icon: 'BookOpenText',
    description: '安全研究者博客、技术文章与知识沉淀。',
    accent: '#be4b79',
    resources: [
      resource('HelloMason', 'https://www.memme.cn/', 'memme.cn', 'Web 安全技术宅。', ['博客', '安全'], 'Blog'),
      resource('HackTricks', 'https://book.hacktricks.xyz/', 'book.hacktricks.xyz', '渗透测试和云安全知识库。', ['知识库', '渗透'], 'Book'),
      resource('The DFIR Report', 'https://thedfirreport.com/', 'thedfirreport.com', '入侵事件复盘和检测建议。', ['蓝队', '响应'], 'DFIR'),
      resource('Elastic Security Labs', 'https://www.elastic.co/security-labs', 'elastic.co', '安全研究和检测工程文章。', ['研究', '检测'], 'Labs'),
    ],
  },
  {
    id: 'language',
    name: '语言学习',
    icon: 'Languages',
    description: '开发语言、脚本和文档资源。',
    accent: '#0284c7',
    resources: [
      resource('MDN Web Docs', 'https://developer.mozilla.org/', 'developer.mozilla.org', 'Web 技术文档。', ['Web', '文档'], 'MDN'),
      resource('Python Docs', 'https://docs.python.org/3/', 'docs.python.org', 'Python 官方文档。', ['Python', '文档'], 'Py'),
      resource('Go Docs', 'https://go.dev/doc/', 'go.dev', 'Go 官方文档和教程。', ['Go', '文档'], 'Go'),
    ],
  },
  {
    id: 'src',
    name: 'SRC众测',
    icon: 'BadgeDollarSign',
    description: '漏洞众测、企业 SRC 和提交入口。',
    accent: '#9333ea',
    resources: [
      resource('补天平台', 'https://www.butian.net/', 'butian.net', '企业 SRC 和漏洞众测平台。', ['SRC', '众测'], '补天'),
      resource('漏洞盒子', 'https://www.vulbox.com/', 'vulbox.com', '安全众测和漏洞提交平台。', ['SRC', '众测'], '盒子'),
      resource('HackerOne', 'https://www.hackerone.com/', 'hackerone.com', '国际漏洞赏金平台。', ['BugBounty', 'SRC'], 'H1'),
      resource('Bugcrowd', 'https://www.bugcrowd.com/', 'bugcrowd.com', '漏洞赏金和众测平台。', ['BugBounty', 'SRC'], 'BC'),
    ],
  },
]

export const securityFeeds = [
  {
    id: 'mason',
    name: 'Mason资讯',
    rss: 'https://memme.cn/rss.xml',
    items: [
      feed('Nginx反向代理与端口转发详解', 'https://memme.cn/'),
      feed('新年新气象，2026年新年Flag', 'https://memme.cn/'),
      feed('Mason Blog Web安全技术文章', 'https://memme.cn/'),
      feed('安全工具与运维笔记整理', 'https://memme.cn/'),
      feed('渗透测试学习资料归档', 'https://memme.cn/'),
    ],
  },
  {
    id: 't00ls',
    name: 'T00ls',
    items: [
      feed('新型 wp2shell WordPress 核心漏洞可导致远程代码执行', 'https://www.t00ls.com/'),
      feed('内网-域渗透-信息收集1', 'https://www.t00ls.com/'),
      feed('CET-Enum-CallStack-Spoofer应用在红队对抗中的思路', 'https://www.t00ls.com/'),
      feed('安全公司曝光Cursor AI编码助手安全漏洞', 'https://www.t00ls.com/'),
      feed('Progress Software已紧急通知其SharePoint客户修复漏洞', 'https://www.t00ls.com/'),
    ],
  },
  {
    id: 'xz',
    name: '先知社区',
    items: [
      feed('从真实案例看 Java 反序列化利用链排查', 'https://xz.aliyun.com/'),
      feed('一次边界资产弱口令到内网横向的复盘', 'https://xz.aliyun.com/'),
      feed('WebShell 流量检测规则的误报收敛', 'https://xz.aliyun.com/'),
      feed('OAuth 配置错误导致账号接管的风险分析', 'https://xz.aliyun.com/'),
      feed('云上 AK 泄露后的权限边界梳理', 'https://xz.aliyun.com/'),
    ],
  },
  {
    id: 'freebuf',
    name: 'FreeBuf',
    items: [
      feed('AI 时代下企业安全运营流程再设计', 'https://www.freebuf.com/'),
      feed('勒索软件攻击链中的常见持久化手法', 'https://www.freebuf.com/'),
      feed('供应链安全事件响应清单', 'https://www.freebuf.com/'),
      feed('红蓝对抗中的钓鱼邮件检测策略', 'https://www.freebuf.com/'),
      feed('主机日志分析中的关键字段整理', 'https://www.freebuf.com/'),
    ],
  },
  {
    id: 'qianxin',
    name: '奇安信攻防社区',
    items: [
      feed('从漏洞通告到规则落地的工程化实践', 'https://forum.butian.net/'),
      feed('浅析常见越权漏洞的测试方法', 'https://forum.butian.net/'),
      feed('攻防演练中的资产暴露面收敛', 'https://forum.butian.net/'),
      feed('一次 SSRF 到云元数据泄露的完整复盘', 'https://forum.butian.net/'),
      feed('蓝队告警降噪与威胁狩猎思路', 'https://forum.butian.net/'),
    ],
  },
]

function resource(title, url, domain, description, tags, badge) {
  return { title, url, domain, description, tags, badge }
}

function feed(title, url) {
  return { title, url }
}
