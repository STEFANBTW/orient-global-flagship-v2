#include <iostream>
#include <vector>

using namespace std;

long long calculateFiboDP(int n, vector<long long>& cache) {
    if (n <= 1) return n;
    if (cache[n] != -1) return cache[n];
    
    cache[n] = calculateFiboDP(n - 1, cache) + calculateFiboDP(n - 2, cache);
    return cache[n];
}

long long getFibonacciDP(int n) {
    vector<long long> cache(n + 1, -1);
    return calculateFiboDP(n, cache);
}

int main() {
    int n = 10;
    cout << "Dynamic Programming result for " << n << " is: " << getFibonacciDP(n) << endl;
    return 0;
}
