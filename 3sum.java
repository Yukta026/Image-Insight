class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // Brute - tc = O(n^3) and sc = O(2*N)
        List<List<Integer>> ans = new ArrayList<>();
        int n = nums.length;
        Arrays.sort(nums);
        for(int i=0;i<n;i++){
            for(int j =i;j<n;j++){
                for(int k = j;k<n;k++){
                    if(i != j && i != k && k != j){
                        if(nums[i] + nums[j] + nums[k] == 0){
                            List<Integer> newarr = new ArrayList<>();
                            newarr.add(nums[i]);
                            newarr.add(nums[j]);
                            newarr.add(nums[k]);
                            if(!ans.contains(newarr)){
                                ans.add(newarr);
                            }
                            
                        }
                    }
                }
            }
        }
        return ans;

        // Better - tc= O(n^2* log(N)) and sc= O(2*n no. of unique triplets) + O(N)
        Set<List<Integer>> st = new HashSet<>();
        int n = nums.length;
        for(int i=0;i<n;i++){
            Set<Integer> res = new HashSet<>();
            for(int j = i+1;j<n;j++){
                int third = - (nums[i] + nums[j]);
                if(res.contains(third)){
                    List<Integer> newarr = Arrays.asList(nums[i],nums[j],third);
                    newarr.sort(null);
                    st.add(newarr);
                }
                res.add(nums[j]);
            }

        }

        List<List<Integer>> ans = new ArrayList<>(st);
        return ans;

        // Optimal - tc = O(N*logN) + O(N^2) and sc= O(no. of triplets) = O(1)
        Arrays.sort(nums);
        int n=  nums.length;
        List<List<Integer>> ans = new ArrayList<>();
        for(int i=0;i<n;i++){
            if(i != 0. && nums[i] == nums[i-1]){
                continue;
            }
            int j = i+1;
            int k = n-1;
            while(j < k){
                int sum = nums[i] + nums[j] + nums[k];
                if(sum == 0){
                    List<Integer> temp = Arrays.asList(nums[i],nums[j],nums[k]);
                    ans.add(temp);
                    j++;
                    k--;
                    while(j < k && nums[j] == nums[j-1])j++;
                    while(j < k && nums[k] == nums[k+1])k--;
                }
                else if(sum > 0){
                    k--;
                }
                else{
                    j++;
                }
            }

        }
        return ans;
    }
}
