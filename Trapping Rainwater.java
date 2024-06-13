class Solution {
    public int trap(int[] height) {
        // Brute - tc = O(N^2) and sc = O(1)
        int n = height.length;
        int sum = 0;
        for(int i=0;i<n;i++){
            int leftMax = 0;
            int rightMax = 0;
            int j = i;
            while(j >= 0){
                leftMax = Math.max(leftMax, height[j]);
                j--;
            }
            j = i;
            while(j < n){
                rightMax = Math.max(rightMax, height[j]);
                j++;
            }
            
            sum += Math.min(leftMax, rightMax) - height[i];
            
        }
        return sum;

        // Better - tc = O(3*N) and sc = O(N) + O(N) (for suffix and prefix arrays)
        int n = height.length;
        int[] prefix = new int[n];
        int[] suffix = new int[n];
        prefix[0] = height[0];
        for(int i=1;i<n;i++){
                prefix[i] = Math.max(prefix[i-1], height[i]);
                
        }
        suffix[n-1] = height[n-1];
        for(int i = n-2 ;i >= 0;i--){
            suffix[i] = Math.max(suffix[i+1],height[i]);
        }
        int waterTrapped = 0;
        for(int i=0;i<n;i++){
            
            waterTrapped += Math.min(prefix[i] , suffix[i]) - height[i];
        }
        return waterTrapped;

        // Optimal - tc = O(N) and sc = O(1)
        int n = height.length;
        int l = 0;
        int r = n-1;
        int leftMax = 0;
        int rightMax = 0;
        int res = 0;

        while(l <= r){
            if(height[l] < height[r]){
            if(leftMax  <= height[l]){
                leftMax = height[l];
            }
            else{
                res += leftMax  - height[l];
            }
            l++;
        }else{
            if(rightMax  <= height[r]){
                rightMax = height[r];
            }
            else{
                res += rightMax  - height[r];
            }
            r--;
        }
        }
        return res;
    }
}
