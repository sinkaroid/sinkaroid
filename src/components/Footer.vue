<template>
  <footer class="footer-glass">
    <div class="footer-container">
      <!-- Left side: Commit display -->
      <div
        v-if="latest_commit"
        class="commit-section"
      >
        <a 
          :href="base_repo" 
          target="_blank" 
          class="commit-link-btn clickable"
          aria-label="View latest commit on GitHub"
        >
          <i class="fas fa-code-branch" /> {{ truncatedCommit }}
        </a>
      </div>
      <div
        v-else
        class="commit-section"
      >
        <span class="loading-commit"><i class="fas fa-spinner fa-spin" /> loading commit...</span>
      </div>

      <!-- Right side: Social links -->
      <div class="social-section">
        <a 
          :href="linkedin" 
          target="_blank" 
          class="social-icon clickable"
          data-tooltip="LinkedIn"
          aria-label="LinkedIn profile"
        >
          <i class="fab fa-linkedin" />
        </a>
        
        <a 
          :href="github" 
          target="_blank" 
          class="social-icon clickable"
          data-tooltip="GitHub"
          aria-label="GitHub profile"
        >
          <i class="fab fa-github" />
        </a>

        <a 
          :href="twitter" 
          target="_blank" 
          class="social-icon clickable"
          data-tooltip="Twitter"
          aria-label="Twitter profile"
        >
          <i class="fab fa-twitter" />
        </a>

        <a 
          :href="resume" 
          target="_blank" 
          class="social-icon clickable"
          data-tooltip="Resume"
          aria-label="Resume document"
        >
          <i class="far fa-file-pdf" />
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import info from "../../ci/mockRepository";

defineProps({
  nightMode: {
    type: Boolean,
    default: false
  }
});

const linkedin = info.links?.linkedin || "#";
const github = info.links?.github || "#";
const twitter = info.links?.twitter || "#";
const resume = info.links?.resume || "#";

const latest_commit = ref(null);
const base_repo = ref(null);

const truncatedCommit = computed(() => {
  if (!latest_commit.value) return "";
  return latest_commit.value.substring(0, 7);
});

// Native Cache helpers to replace lscache
const cacheCommit = (sha) => {
  const item = { val: sha, expiry: Date.now() + 5 * 60 * 1000 }; // 5 mins
  localStorage.setItem("latest_commit", JSON.stringify(item));
};

const getCachedCommit = () => {
  const data = localStorage.getItem("latest_commit");
  if (!data) return null;
  
  try {
    const item = JSON.parse(data);
    if (Date.now() > item.expiry) {
      localStorage.removeItem("latest_commit");
      return null;
    }
    return item.val;
  } catch {
    localStorage.removeItem("latest_commit");
    return null;
  }
};

const fetchCommit = async () => {
  const cached = getCachedCommit();
  if (cached) {
    latest_commit.value = cached;
    base_repo.value = `https://github.com/sinkaroid/sinkaroid/commit/${cached}`;
    return;
  }

  try {
    const response = await fetch("https://api.github.com/repos/sinkaroid/sinkaroid/commits/master");
    if (!response.ok) throw new Error("API request failed");
    const data = await response.json();
    latest_commit.value = data.sha;
    base_repo.value = `https://github.com/sinkaroid/sinkaroid/commit/${data.sha}`;
    cacheCommit(data.sha);
  } catch (err) {
    console.error("Error fetching latest commit:", err.message);
    // Fallback to offline config commit
    if (info.links?.latest_commit) {
      latest_commit.value = info.links.latest_commit;
      base_repo.value = `https://github.com/sinkaroid/sinkaroid/commit/${info.links.latest_commit}`;
    }
  }
};

onMounted(() => {
  fetchCommit();
});
</script>

<style scoped>
.footer-glass {
  background: var(--card-bg);
  border-top: 1px solid var(--card-border);
  backdrop-filter: var(--card-blur);
  -webkit-backdrop-filter: var(--card-blur);
  padding: var(--space-4) 0;
  margin-top: auto;
}

.footer-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.commit-section {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--muted-foreground);
}

.commit-link-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--muted-foreground);
  background: var(--card-border);
  border: 1px solid var(--card-border);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.commit-link-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(var(--accent-rgb), 0.05);
}

.loading-commit {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.social-section {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.social-icon {
  color: var(--muted-foreground);
  font-size: 1.15rem;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid var(--card-border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.social-icon:hover {
  background: var(--accent-gradient);
  border-color: transparent;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.2);
}

@media (max-width: 576px) {
  .footer-container {
    flex-direction: column;
    text-align: center;
  }
}
</style>
