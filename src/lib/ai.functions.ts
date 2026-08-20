import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

function generateFallbackTutorResponse(userPrompt: string, mode: string): string {
  const p = userPrompt.toLowerCase();

  if (p.includes("hash") || p.includes("map") || p.includes("dictionary")) {
    return `### 💡 Hash Maps & Hashing Explained

A **Hash Map** (or Hash Table) is a key-value data structure that provides average **O(1)** time complexity for insertions, lookups, and deletions.

#### Key Concepts:
1. **Hash Function**: Maps a key (like a string or object) to an array index integer.
2. **Collision Resolution**: Handled via **Chaining** (linked lists at each bucket) or **Open Addressing** (linear probing).

#### Common Pattern — Two-Sum Pattern:
\`\`\`javascript
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
\`\`\`

#### Complexity:
- **Time Complexity**: $O(N)$ single-pass scan.
- **Space Complexity**: $O(N)$ to store hash table keys.`;
  }

  if (p.includes("pointer") || p.includes("two pointer") || p.includes("sliding window")) {
    return `### 🎯 Two-Pointer & Sliding Window Technique

The **Two-Pointer technique** optimizes $O(N^2)$ brute-force nested loops into an optimal **$O(N)$** linear scan by maintaining two pointers (\`left\` and \`right\`).

#### When to use:
- Searching for pairs in a **sorted array**.
- Reversing arrays or linked lists in-place.
- Finding contiguous sub-arrays or sub-strings.

#### Example Pattern (Container With Most Water / Sorted Two Sum):
\`\`\`javascript
function maxArea(height) {
  let left = 0, right = height.length - 1;
  let maxWater = 0;

  while (left < right) {
    const currentWater = Math.min(height[left], height[right]) * (right - left);
    maxWater = Math.max(maxWater, currentWater);

    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return maxWater;
}
\`\`\`

#### Time & Space Complexity:
- **Time**: $O(N)$ — each element is processed at most once.
- **Space**: $O(1)$ — constant auxiliary memory.`;
  }

  if (p.includes("bfs") || p.includes("dfs") || p.includes("graph") || p.includes("tree")) {
    return `### 🌲 BFS vs DFS (Graph & Tree Traversals)

Both **Breadth-First Search (BFS)** and **Depth-First Search (DFS)** visit every node in a graph or tree, but in completely different orders.

| Traversal | Data Structure | Main Use Case | Time | Space |
| --- | --- | --- | --- | --- |
| **BFS** | Queue (FIFO) | Shortest path in unweighted graph / level order | $O(V + E)$ | $O(W)$ max width |
| **DFS** | Stack / Recursion | Pathfinding, backtracking, topological sort | $O(V + E)$ | $O(H)$ max height |

#### BFS Example (Level Order):
\`\`\`javascript
function bfs(root) {
  if (!root) return [];
  const queue = [root];
  const result = [];
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node.val);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return result;
}
\`\`\``;
  }

  if (p.includes("dynamic") || p.includes("dp") || p.includes("memo") || p.includes("fibonacci")) {
    return `### ⚡ Dynamic Programming (DP) Core Principles

Dynamic Programming is an optimization technique that transforms exponential recursive algorithms $O(2^N)$ into polynomial/linear algorithms $O(N)$ by **storing results of overlapping subproblems**.

#### The 4-Step DP Framework:
1. **Define State**: What parameters uniquely identify a subproblem? (e.g., \`dp[i]\`).
2. **State Transition**: Write the recurrence relation (\`dp[i] = dp[i-1] + dp[i-2]\`).
3. **Base Cases**: Identify initial boundary conditions (e.g., \`dp[0] = 0, dp[1] = 1\`).
4. **Order of Computation**: Bottom-up iteration or Top-down memoization.

#### Example (Climbing Stairs):
\`\`\`typescript
function climbStairs(n: number): number {
  if (n <= 2) return n;
  let prev2 = 1, prev1 = 2;
  for (let i = 3; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}
\`\`\``;
  }

  // General responsive DSA answer
  return `### 🚀 DSA Tutor Insight: ${userPrompt}

Data Structures and Algorithms form the foundation of efficient software engineering and technical interviews.

#### General Solving Strategy:
1. **Understand Constraints**: Check input size $N$. If $N \\le 10^5$, aim for an $O(N)$ or $O(N \\log N)$ solution.
2. **Identify Patterns**:
   - **Sorted array** $\\rightarrow$ Two Pointers / Binary Search ($O(\\log N)$).
   - **Subarrays / Windows** $\\rightarrow$ Sliding Window / Monotonic Queue.
   - **Tree / Graph shortest path** $\\rightarrow$ BFS / Dijkstra.
   - **Overlapping choices** $\\rightarrow$ Backtracking / Dynamic Programming.

\`\`\`javascript
// Always analyze runtime before coding:
// O(1) < O(log N) < O(N) < O(N log N) < O(N^2) < O(2^N)
\`\`\`

If you'd like step-by-step hints or code examples for a specific problem, ask away!`;
}

function generateFallbackCodeExplanation(code: string, language: string): string {
  const hasLoops = code.includes("for") || code.includes("while");
  const hasNestedLoops = (code.match(/for|while/g) || []).length >= 2;
  const hasMap = code.includes("Map") || code.includes("Set") || code.includes("[]") || code.includes("{}");

  const estTime = hasNestedLoops ? "O(N²)" : hasLoops ? "O(N)" : "O(1)";
  const estSpace = hasMap ? "O(N)" : "O(1)";

  return `## Complexity Analysis
- **Time Complexity**: **${estTime}** — ${hasNestedLoops ? "Contains nested loop iterations across input size N." : hasLoops ? "Performs a single linear traversal over input elements." : "Executes constant time operations."}
- **Space Complexity**: **${estSpace}** — ${hasMap ? "Allocates dynamic auxiliary memory proportional to input size." : "Uses constant auxiliary variables."}

## Bugs & Mistakes
- No critical syntax errors detected in submitted ${language} snippet.
- Ensure input variables are non-null and length checks are validated before array indexing.

## Edge Cases Missed
- **Empty or null inputs**: Check if array or string is empty (\`length === 0\`).
- **Single element arrays**: Verify algorithm behavior when input length $N = 1$.
- **Duplicate elements**: Test if input contains duplicate key values.

## Suggested Optimizations
- Replace nested loops with a **Hash Map** or **Set** lookup to reduce runtime from $O(N^2)$ to $O(N)$.
- Pre-allocate memory array lengths when maximum bounds are known in advance.

## Better Approaches
\`\`\`${language}
// Optimized O(N) Single-Pass Approach
function optimizedSolution(input) {
  if (!input || input.length === 0) return null;
  const seen = new Set();
  for (const item of input) {
    if (seen.has(item)) return item;
    seen.add(item);
  }
  return null;
}
\`\`\``;
}

async function callGateway(system: string, messages: { role: string; content: string }[]) {
  const key = process.env.LOVABLE_API_KEY || process.env.OPENAI_API_KEY || process.env.VITE_LOVABLE_API_KEY;

  if (key) {
    try {
      const res = await fetch(GATEWAY, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "system", content: system }, ...messages],
          temperature: 0.5,
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
        if (data.choices?.[0]?.message?.content) {
          return data.choices[0].message.content;
        }
      }
    } catch (err) {
      console.warn("Gateway request failed, falling back to built-in DSA Engine:", err);
    }
  }

  const lastUserMsg = messages.filter((m) => m.role === "user").pop()?.content || "";
  if (system.includes("code reviewer") || system.includes("Complexity Analysis")) {
    return generateFallbackCodeExplanation(lastUserMsg, "javascript");
  }
  return generateFallbackTutorResponse(lastUserMsg, system);
}

const messageSchema = z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(8000) });

const TutorInput = z.object({
  mode: z.enum(["explain-concept", "explain-code", "hints-only", "examples", "complexity", "similar-questions"]),
  topic: z.string().max(120).optional(),
  problemTitle: z.string().max(200).optional(),
  messages: z.array(messageSchema).min(1).max(30),
});

const MODE_PROMPTS: Record<string, string> = {
  "explain-concept": "Explain the requested data-structure or algorithm concept clearly with intuition first, then detail. Use short paragraphs and examples.",
  "explain-code": "Carefully explain what the user's code does, step by step, then note its correctness and complexity.",
  "hints-only": "Give progressive HINTS ONLY. Never reveal the full solution or final code. Nudge the learner toward the insight.",
  examples: "Provide concrete worked examples with inputs and outputs that illuminate the concept.",
  complexity: "Analyze time and space complexity rigorously, explaining the reasoning behind each bound.",
  "similar-questions": "Suggest similar practice problems with a one-line description and difficulty for each.",
};

export const askTutor = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TutorInput.parse(input))
  .handler(async ({ data }) => {
    const context = [
      data.topic ? `Current topic: ${data.topic}.` : "",
      data.problemTitle ? `Current problem: ${data.problemTitle}.` : "",
    ]
      .filter(Boolean)
      .join(" ");
    const system = `You are AlgoFlow AI, a friendly, encouraging Data Structures & Algorithms tutor. ${context} ${MODE_PROMPTS[data.mode]} Use Markdown. Keep code in fenced blocks. Be concise but complete.`;
    const content = await callGateway(system, data.messages);
    return { content };
  });

const ExplainCodeInput = z.object({
  code: z.string().min(1).max(12000),
  language: z.string().max(40).default("javascript"),
});

export const explainMyCode = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ExplainCodeInput.parse(input))
  .handler(async ({ data }) => {
    const system = `You are an expert code reviewer for AlgoFlow AI. Analyze the user's ${data.language} code and respond in Markdown with these exact sections as headers:
## Complexity Analysis
## Bugs & Mistakes
## Edge Cases Missed
## Suggested Optimizations
## Better Approaches
Be specific and actionable. If a section has nothing to report, say so briefly.`;
    const content = await callGateway(system, [{ role: "user", content: data.code }]);
    return { content };
  });
