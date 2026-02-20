/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */
export function createElection(candidates) {
  const votes = [];
  const registeredVoters = [];

  const registerVoter = (voter) => {
    const validField = ["id", "name", "age"];
    if (voter === null || typeof voter !== "object") return false;

    const voterObjectKeys = Object.keys(voter);
    if (voterObjectKeys.length !== 3) return false;

    for (const key of voterObjectKeys) {
      if (!validField.includes(key)) return false;
    }

    if (voter.age < 18) return false;

    const isDuplicateVoterID = registeredVoters.find((vo) => vo.id === voter.id);
    if (isDuplicateVoterID) return false;

    registeredVoters.push(voter);
    return true;
  }
  const castVote = (voterId, candidateId, onSuccess, onError) => {
    const isRegistered = registeredVoters.find((user) => user.id === voterId);
    if (!isRegistered) return onError("Voter does not exist");

    const isCandidateExist = candidates.find((candidate) => candidate.id === candidateId);

    if (!isCandidateExist) return onError("Candidate does't exist");

    const alreadyVoted = votes.find((vote) => vote.voterId === voterId);
    if (alreadyVoted) return onError("This candidate has already voted.")

    votes.push({ candidateId, voterId });
    return onSuccess({ voterId, candidateId });

  }
  const getResults = (sortFn) => {
    const candidatesResults = candidates.map((candidate) => {
      const voteCount = votes.reduce((acc, curr) => {
        if (curr.candidateId === candidate.id) return acc + 1;
        return acc;
      }, 0);

      const candidateCpy = structuredClone(candidate);
      candidateCpy.votes = voteCount;
      return candidateCpy;
    });

    if (sortFn || typeof sortFn === "function") return candidatesResults.sort(sortFn);
    return candidatesResults.sort((a, b) => b.votes - a.votes);
  }

  const getWinner = () => {
    if (votes.length === 0) return null;
    const results = getResults();
    if (results.length === 0) return null;
    const winner = results[0];

    return candidates.find((candidate) => candidate.id === winner.id);
  }

  return { registerVoter, castVote, getResults, getWinner };
}

export function createVoteValidator(rules) {
  return function (voter) {
    const voterKeys = Object.keys(voter);
    if (voterKeys.length !== rules.requiredFields.length) {
      return {
        valid: false,
        reason: "invalid fields"
      };
    }

    for (const key of Object.keys(voter)) {
      if (!rules.requiredFields.includes(key)) return {
        valid: false,
        reason: "invalid keys"
      };
    }

    if (voter.age < rules.minAge) return { valid: false, reason: "invalid age" };

    return { valid: true }
  }
}

export function countVotesInRegions(regionTree) {
  if (regionTree === null || typeof regionTree !== "object") return 0;
  let totalVote = 0;
  totalVote += regionTree.votes;

  if (regionTree.subRegions.length > 0) {
    for (const newRegion of regionTree.subRegions) {
      totalVote += countVotesInRegions(newRegion);
    }
  }

  return totalVote;
}

export function tallyPure(currentTally, candidateId) {
  const currentTallyCpy = structuredClone(currentTally);

  const currentTallyKeys = Object.keys(currentTally);
  for (const key of currentTallyKeys) {
    if (candidateId === key) currentTallyCpy[key]++;
  }
  if (!currentTallyCpy[candidateId]) currentTallyCpy[candidateId] = 1;
  return currentTallyCpy;
}
